USE hearsay_db;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Create user (should be func? should return success or fail?)
DROP PROCEDURE IF EXISTS create_user;
DELIMITER $$
CREATE PROCEDURE create_user
(
	email VARCHAR(32),
    username VARCHAR(32),
    password_hash VARCHAR(32),
    first_name VARCHAR(32),
    last_name VARCHAR(32)
)
BEGIN
	IF email NOT IN (SELECT user.email FROM user) THEN
		INSERT INTO user(email, username, password_hash, first_name, last_name) VALUES (email, username, password_hash, first_name, last_name);
	END IF;
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Get user
DROP PROCEDURE IF EXISTS get_user;
DELIMITER $$
CREATE PROCEDURE get_user
(
	username VARCHAR(32),
    password_hash VARCHAR(32)
)
BEGIN
	SELECT id FROM user WHERE user.email = email AND user.password_hash = password_hash;
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Update bio
DROP PROCEDURE IF EXISTS update_bio;
DELIMITER $$
CREATE PROCEDURE update_bio
(
	user_id INT,
    bio VARCHAR(255)
)
BEGIN
	UPDATE user
    SET user.bio = bio WHERE user.id = user_id;
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Get friends
DROP PROCEDURE IF EXISTS get_friends;
DELIMITER $$
CREATE PROCEDURE get_friends
(
	user_id INT
)
BEGIN
	SELECT * FROM user_to_user WHERE id1 = user_id AND status = "accepted";
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Delete friend
DROP PROCEDURE IF EXISTS delete_friend;
DELIMITER $$
CREATE PROCEDURE delete_friend
(
	user_id INT,
    user_to_delete_id INT
) 
BEGIN
	DELETE FROM user_to_user WHERE id1 = user_id AND id2 = user_to_delete_id AND status = "accepted";
END $$
DELIMITER ;

-- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------