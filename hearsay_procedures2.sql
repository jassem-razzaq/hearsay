/*
Insert podcast review
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS insert_podcast_review $$
CREATE PROCEDURE insert_podcast_review(IN user_id_p INT, IN podcast_id_p INT, IN rating_p INT, IN text_p VARCHAR(255))
BEGIN
    INSERT INTO podcast_review (user_id, podcast_id, rating, text) 
    VALUES (user_id_p, podcast_id_p, rating_p, text_p);
END $$
DELIMITER ;

INSERT INTO user(email, username, password_hash, first_name, last_name) VALUES ("pham.har@email", "pham-har", "root1234", "Harrison", "Pham");
CALL insert_podcast_review(51, 1, 5, NULL);
SELECT * FROM podcast_review WHERE user_id = 51;



/*
Update podcast review
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS update_podcast_review $$
CREATE PROCEDURE update_podcast_review(IN user_id_p INT, IN podcast_id_p INT, IN rating_p INT, IN text_p VARCHAR(255))
BEGIN
    UPDATE podcast_review
    SET rating = rating_p, text = text_p
    WHERE user_id = user_id_p AND podcast_id = podcast_id_p;
END $$
DELIMITER ;

CALL update_podcast_review(51, 1, 4, "Not as good as I remember");
SELECT * FROM podcast_review WHERE user_id = 51;



/*
Insert podcast episode review
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS insert_podcast_episode_review $$
CREATE PROCEDURE insert_podcast_episode_review(IN user_id_p INT, IN podcast_id_p INT, IN episode_num_p INT, IN rating_p INT, IN text_p VARCHAR(255))
BEGIN
    INSERT INTO episode_review (user_id, podcast_id, episode_num, rating, text) 
    VALUES (user_id_p, podcast_id_p, episode_num_p, rating_p, text_p);
END $$
DELIMITER ;

CALL insert_podcast_episode_review(51, 1, 1169, 5, "Amazing");
SELECT * FROM episode_review WHERE user_id = 51;



/*
Update podcast episode review
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS update_podcast_episode_review $$
CREATE PROCEDURE update_podcast_episode_review(IN user_id_p INT, IN podcast_id_p INT, IN episode_num_p INT, IN rating_p INT, IN text_p VARCHAR(255))
BEGIN
    UPDATE episode_review
    SET rating = rating_p, text = text_p
    WHERE user_id = user_id_p AND podcast_id = podcast_id_p AND episode_num = episode_num_p;
END $$
DELIMITER ;

CALL update_podcast_episode_review(51, 1, 1169, 2, "Boring");
SELECT * FROM episode_review WHERE user_id = 51;



/*
Get global podcast average rating
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS get_global_podcast_avg_rating $$
CREATE PROCEDURE get_global_podcast_avg_rating(IN podcast_id_p INT)
BEGIN
	SELECT AVG(rating)
    FROM podcast 
	JOIN podcast_review ON podcast.id = podcast_review.podcast_id
    WHERE podcast.id = podcast_id_p;
END $$
DELIMITER ;

CALL get_global_podcast_avg_rating(1);

/*
Get global podcast avg rating by episode
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS get_global_podcast_episode_avg_rating $$
CREATE PROCEDURE get_global_podcast_episode_avg_rating(IN podcast_id_p INT)
BEGIN
	SELECT AVG(rating)
    FROM podcast 
    JOIN episode_review ON podcast.id = episode_review.podcast_id
    WHERE podcast.id = podcast_id_p;
END $$
DELIMITER ;

CALL get_global_podcast_episode_avg_rating(1);



/*
Get a user's rating of a podcast
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS get_user_podcast_rating $$
CREATE PROCEDURE get_user_podcast_rating(IN user_id_p INT, IN podcast_id_p INT)
BEGIN
	SELECT rating
    FROM user
    JOIN podcast_review ON user.id = podcast_review.user_id
    WHERE user.id = user_id_p AND podcast_review.podcast_id = podcast_id_p;
END $$
DELIMITER ;

CALL get_user_podcast_rating(4, 5);



/*
Get a user's avg episode rating for a podcast
*/