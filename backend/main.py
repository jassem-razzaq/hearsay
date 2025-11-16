from fastapi import FastAPI
import pymysql
import bcrypt
from typing import Dict

app = FastAPI()

host = "localhost"
user = "root"
password = "root1234"
database = "hearsay_db"

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/users")
async def create_user(data: Dict):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            cursorclass=pymysql.cursors.DictCursor,
        )
        cursor = connection.cursor()

        email = data["email"]
        username = data["username"]
        password = data["pass"].encode("utf-8")
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        first_name = data["firstName"]
        last_name = data["lastName"]
        cursor.callproc("create_user", (email, username, hashed_password, first_name, last_name))
        connection.commit()
        return {"message": "User created successfully"}
    except pymysql.IntegrityError as e:
        return {"message": "User already exists"}
    finally:
        connection.close()

@app.post("/users/login")
async def log_in_user(data: Dict):
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            cursorclass=pymysql.cursors.DictCursor,
        )
        cursor = connection.cursor()

        username = data["username"]
        password = data["password"].encode("utf-8")
        query = "SELECT * FROM user WHERE username=%s"
        cursor.execute(query, (username,))
        user_info = cursor.fetchone()
        stored_password = user_info["password_hash"].encode("utf-8")
        if bcrypt.checkpw(password, stored_password):
            return {"user_id": user_info["id"], "logged_in": True}
        else:
            return {"user_id": None, "logged_in": False}
    finally:
        connection.close()