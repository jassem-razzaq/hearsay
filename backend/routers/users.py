from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..db import db_cursor
from .playlists import router as playlist_router
import jwt
import pymysql
import bcrypt

JWT_SECRET = "sIxSeVeNsIxSeVeNsIxSeVeN"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
router = APIRouter(prefix="/users")
router.include_router(playlist_router, prefix="/{user_id}/playlists")

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    firstName: str
    lastName: str

class UserPublic(BaseModel):
    id: int
    email: EmailStr
    username: str
    firstName: str
    lastName: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserBio(BaseModel):
    bio: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Password helper functions
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )

# JWT helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=400, detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=400, detail="Invalid token"
        )

# Get current user
def getCurrentUser(token: str = Depends(oauth2_scheme)) -> UserPublic:
    payload = decode_access_token(token)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=400,
            detail="Token payload missing subject",
        )
    user_row = getUserByUsername(username)
    if not user_row:
        raise HTTPException(
            status_code=400, detail="User not found"
        )

    return UserPublic(
        id=user_row["id"],
        email=user_row["email"],
        username=user_row["username"],
        firstName=user_row["first_name"],
        lastName=user_row["last_name"]
    )

# Create user account
@router.post("/", status_code=201)
def createUser(data: UserCreate):
    try:
        with db_cursor() as cursor:
            hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt())
            cursor.callproc("create_user", (data.email, data.username, hashed_password, data.firstName, data.lastName))
            return {"userCreated": True, "message": f"User {data.username} created successfully"}
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        print("Operation error: ", error_code, message)
        raise HTTPException(status_code=400, detail="Error in create user")

# Register a new user
@router.post("/register", response_model=UserPublic, status_code=201)
async def signup(user: UserCreate):
    user_id = createUser(user)
    created = getUserByUsername(user.username)
    print("DEBUG created:", created, "keys:", created.keys())
    return UserPublic(
        id=created["id"],
        email=created["email"],
        username=created["username"],
        firstName=created["first_name"],
        lastName=created["last_name"]
    )

# Login a registered user
@router.post("/login", response_model=Token)
async def logInUser(data: OAuth2PasswordRequestForm = Depends()):
    try:
        with db_cursor() as cursor:
            db_user = getUserByUsername(data.username)
            if not db_cursor:
                raise HTTPException(status_code=400, detail="Invalid username and/or password")
            if not verify_password(data.password, data["password_hash"]):
                raise HTTPException(status_code=400, detail="Invalid username and/or password")
            
            access_token = create_access_token(data={"sub": db_user["username"]})
            return Token(access_token=access_token)
            """
            cursor.callproc("get_user_log_in_details", (data.username,))
            user_info = cursor.fetchone()
            
            password = data.password.encode("utf-8")
            stored_password = user_info["password_hash"].encode("utf-8")

            if bcrypt.checkpw(password, stored_password):
                return {"user_id": user_info["id"], "logged_in": True}
            else:
                raise HTTPException(status_code=400, detail="Invalid username and/or password")
            """
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail=message)

# test endpoint
@router.get("/me", response_model=UserPublic)
async def read_me(current_user: UserPublic = Depends(getCurrentUser)):
    return current_user

# Get all user details
@router.get("/{user_id}")
async def getUser(user_id: int):
    try:
        with db_cursor() as cursor:
            cursor.callproc("get_user_by_id", (user_id,))
            user_info = cursor.fetchone()
            return user_info
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail=message)

# Get user by username
@router.get("/username/{user_name}")
def getUserByUsername(user_name: str):
    try:
        with db_cursor() as cursor:
            cursor.callproc("get_user_by_username", (user_name,))
            user_info = cursor.fetchone()
            return user_info
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail="Error in get user by username")

# Update user bio
@router.put("/{user_id}")
async def updateBio(user_id: int, data: UserBio):
    try:
        with db_cursor() as cursor:
            cursor.callproc("update_bio", (user_id, data.bio))
            return {"bioUpdated": True, "message": "User bio updated successfully", "bio": data.bio}
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail=message)

# Get all friends for a user
@router.get("/{user_id}/friends")
async def getUserFriends(user_id: int):
    try:
        with db_cursor() as cursor:
            cursor.callproc("get_friends", (user_id,))
            user_friends = cursor.fetchall()
            return user_friends
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail=message)

# Delete a user's friends
@router.delete("/{user_id}/friends/{user_to_delete_id}")
async def deleteFriend(user_id: int, user_to_delete_id: int):
    try:
        with db_cursor() as cursor:
            cursor.callproc("delete_friend", (user_id, user_to_delete_id))
            return {"friendDeleted": True}
    except pymysql.err.OperationalError as e:
        error_code, message = e.args
        raise HTTPException(status_code=400, detail=message)