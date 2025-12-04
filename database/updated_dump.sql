USE hearsay_db;

-- Insert Genres
INSERT INTO genre (genre_name, description) VALUES
('Business', 'Entrepreneurship and business strategies'),
('Comedy', 'Humorous and entertaining content'),
('Education', 'Educational and informative content'),
('Gaming', 'Video game news, reviews, and discussions'),
('Health', 'Health, fitness, and wellness topics'),
('History', 'Historical events and stories'),
('Interview', 'Conversational interviews with guests'),
('News', 'Current events and news analysis'),
('Politics', 'Political commentary and analysis'),
('Science', 'Scientific topics and discoveries'),
('Self-Improvement', 'Personal development and growth'),
('Sports', 'Sports news and commentary'),
('Technology', 'Tech news, reviews, and discussions'),
('True Crime', 'Real-life crime stories and investigations');

-- Insert Languages
INSERT INTO language (language_name) VALUES
('English'),
('French'),
('German'),
('Hindi'),
('Italian'),
('Japanese'),
('Korean'),
('Mandarin'),
('Portuguese'),
('Spanish');

-- Insert Platforms
INSERT INTO platform (platform_name, is_subscription_req, subscription_monthly_cost) VALUES
('Spotify', TRUE, 11.99),
('Apple Podcasts', 0, NULL),
('Audible', TRUE, 7.95),
('YouTube', 0, NULL);

-- Insert Hosts
INSERT INTO host (first_name, last_name, bio) VALUES
('Joe', 'Rogan', 'Comedian, podcaster, and UFC commentator'),
('Guy', 'Raz', 'Host of inspiring entrepreneurial and storytelling podcasts'),
('Conan', "O'Brien", 'Comedian and former late-night talk show host'),
('Manoush', 'Zomorodi', 'Journalist exploring technology and culture topics'),
('Daemon', 'Hatfield', 'Video game journalist and reviewer'),
('Jay', 'Shetty', 'Motivational speaker and personal growth coach'),
('Dominic', 'Sandbrook', 'Historian and bestselling author'),
('Michael', 'Barbaro', 'Host of The New York Times Daily podcast'),
('Ira', 'Flatow', 'Science journalist and radio host'),
('Dan', 'Katz', 'Sports analyst and media personality');

INSERT INTO guest (first_name, last_name, bio) VALUES
('Brian', 'Redban', 'Co-founder and early producer of The Joe Rogan Experience'),
('Ari', 'Shaffir', 'Comedian known for stand-up and podcasting'),
('John', 'Heffron', 'Comedian and former Last Comic Standing winner'),
('Sara', 'Blakely', 'Founder of Spanx and self-made entrepreneur'),
('Kevin', 'Systrom', 'Co-founder of Instagram and tech entrepreneur'),
('Mike', 'Kreiger', 'Co-founder of Instagram and software engineer'),
('Cathy', 'Hughes', 'Media entrepreneur and founder of Urban One'),
('Gary', 'Erickson', 'Entrepreneur, founder of Clif Bar'),
('Will', 'Ferrell', 'Actor, comedian, and film producer'),
('Kristen', 'Bell', 'Actress, producer, and advocate'),
('Bill', 'Burr', 'Actor, comedian, and podcast host'),
('Dax', 'Shepard', 'Actor, comedian, and podcast host'),
('Nick', 'Offerman', 'Actor, comedian, and woodworker'),
('Megan', 'Mullally', 'Actress and comedian, known for Will & Grace'),
('Radhi', 'Devlukia', 'Entrepreneur and wellness expert'),
('Russell', 'Brand', 'Comedian, actor, and political commentator'),
('Novak', 'Djokovic', 'Professional tennis player, Grand Slam champion'),
('Mike', 'Posner', 'Singer-songwriter and music producer'),
('Zach', 'Efron', 'Actor and singer in film and television'),
('RJ', 'Hampton', 'Professional basketball player in NBA'),
('Jeff', 'Ross', 'Comedian known for celebrity roasts'),
('Blake', 'Griffin', 'Professional basketball player and sports personality'),
('Manny', 'Pacquiao', 'Professional boxer, politician, and philanthropist');


-- Insert Podcasts
INSERT INTO podcast (name, description, release_date) VALUES
('The Joe Rogan Experience', 'Long-form conversations with diverse, thought-provoking guests', '2009-12-24'),
('How I Built This', 'Entrepreneurs share stories behind building successful companies', '2016-09-12'),
("Conan O'Brien Needs A Friend", 'Conan seeks genuine friendships through funny celebrity interviews', '2018-11-18'),
("TED Radio Hour", 'Ideas and stories inspired by TED talks', "2012-04-27"),
("Game Scoop!", 'Weekly video game news, reviews, and discussions', "2006-07-20"),
("On Purpose with Jay Shetty", 'Insights on mindfulness, purpose, and personal growth', "2019-02-13"),
("The Rest is History", 'Historical events explored with humor and insight', "2020-11-02"),
('The Daily', 'Daily news analysis from The New York Times', '2017-02-01'),
("Science Friday", 'Science news, discoveries, and expert interviews', "1991-10-01"),
("Pardon My Take", 'Humorous sports commentary and interviews with athletes', "2016-02-29");

-- Insert episodes into Joe Rogan
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Brian Redban", "Joe sits down with Brian Redban", 125, "2009-12-24", 1),
(2, "Brian Redban", "Joe sits down with Brian Redban", 155, "2009-12-29", 1),
(3, "Ari Shaffir", "Joe sits down with Ari Shaffir", 138, "2010-01-06", 1),
(4, "Brian Redban", "Joe sits down with Brian Redban", 128, "2009-01-13", 1),
(5, "John Heffron, Ari Shaffir", "Joe sits down with John Heffron and Ari Shaffir", 143, "2010-01-21", 1);

-- Insert episodes into How I Built This
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Introducing: How I Built This With Guy Raz", "Guy Raz interviews the world’s best-known entrepreneurs to learn how they built their iconic brands", 117, "2016-09-02", 2),
(2, "Spanx: Sara Blakely", "At 27, Sara Blakely was selling fax machines and desperate to reinvent her life", 26, "2016-09-12", 2),
(3, "Instagram: Kevin Systrom & Mike Kreiger", "Kevin Systrom and Mike Krieger launched their photo-sharing app with a server that crashed every other hour", 28, "2016-09-19", 2),
(4, "Radio One: Cathy Hughes", "As a kid, Cathy Hughes practiced her DJ routine while her siblings banged on the bathroom door", 32, "2016-09-26", 2),
(5, 'Clif Bar: Gary Erickson", "Gary Erickson asked his mom, "Can you make a cookie without butter, sugar or oil?"', 28, "2016-10-03", 2);

-- Insert episodes into Conan O'Brien Needs a Friend
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Will Ferrell", "Comedian and actor Will Ferrell feels awkward about being Conan O’Brien’s friend", 47, "2018-11-19", 3),
(2, "Kristen Bell", "Actress Kristen Bell feels supercharged about being Conan O’Brien’s friend!", 49, "2018-11-26", 3),
(3, "Bill Burr", "Comedian Bill Burr feels great about being Conan’s friend", 52, "2018-12-03", 3),
(4, "Dax Shepard", "Actor Dax Shepard feels very optimistic about being Conan O’Brien’s friend", 49, "2018-12-10", 3),
(5, "Nick Offerman and Megan Mullally", "Actors and comedic couple Nick Offerman and Megan Mullally feel ambivalent, yet hopeful about being Conan O’Brien’s friends", 50, "2018-12-17", 3);

-- Insert episodes into TED Radio Hour
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Peering Into Space", "Gazing up at the night sky is simultaneously humbling and utterly thrilling", 52, "2014-07-03", 4),
(2, "The Hackers", 'Science and technology now allow us to "hack" solutions to the biggest challenges of our time', 51, "2014-07-11", 4),
(3, "Disruptive Leadership", "Is leadership only reserved for the extraordinary few?", 50, "2014-07-25", 4),
(4, "The Violence Within Us", "Violence and brutality are grim realities of life", 50, "2014-08-08", 4),
(5, "Simply Happy", "We all want to find happiness, but it seems elusive", 50, "2014-08-15", 4);

-- Insert episodes into Game Scoop!
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Comic-Con Wrap-up", "We partied with celebrities, saw Scott Pilgrim, and even made love connections", 71, "2010-07-28", 5),
(2, "Halo, SOCOM, & Castlevania", "Your favorite IGN Editors always have the Scoop! on your favorite games", 59, "2010-07-31", 5),
(3, "Fave Games of the Year", "2010 is only half over and we already have more great games than we know what to do with", 59, "2010-08-06", 5),
(4, "BioShocker", "BioShock Infinite, Rage, Scott Pilgrim, Lara Croft, and hot Japanese girls", 54, "2010-08-14", 5),
(5, "The Best 58 Minutes of Your Life", "Unless you're a ninja. In that case, this will probably be a let down", 60, "2010-08-27", 5);

-- Insert episodes into On Purpose with Jay Shetty
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Jay Shetty Interviews His Wife for the First Time", "On the first episode of On Purpose, I have an extremely special guest for you", 153, "2019-02-14", 6),
(2, "Russell Brand", "You may think you know Russell Brand - the actor, the comedian, etc... but that’s only a small part of who he truly is", 44, "2019-02-15", 6),
(3, "Novak Djokovic", "Most people, even non-sports fans are inspired by world class athletes like Novak... but why?", 60, "2019-02-18", 6),
(4, "3 Lessons I Learned From My Ex", "Breakups are hard there’s no doubt about that, but sometimes break-ups lead to break-throughs", 28, "2019-02-22", 6),
(5, "Mike Posner", "Mike Posner is the musician behind the hit songs I Took A Pill In Ibiza and Cooler Than Me", 84, "2019-02-25", 6);

-- Insert episodes into The Rest is History
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Greatness", "How did certain people come to be called 'the Great'?", 30, "2020-11-02", 7),
(2, "Civil War", "What are the conditions needed for a civil war to start?", 36, "2020-11-02", 7),
(3, "Is Trump Caesar or Nixon?", "We ask if Donald Trump is a modern day Caesar, willing to do anything to stay in power?", 36, "2020-11-09", 7),
(4, "We're all so 17th Century", "Plague, pestilence and statue smashing are back in business", 34, "2020-11-09", 7),
(5, "1981", "We look back at the year many Britons consider the worst in living memory", 38, "2020-11-16", 7);

-- Insert episodes into The Daily
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Wednesday, Feb 1, 2017", "President Trump announced his Supreme Court nominee: Neil M. Gorsuch", 20, "2017-02-01", 8),
(2, "Thursday, Feb 2, 2017", "Who is influencing our new president’s views of Islam and radical Islamic terrorism?", 23, "2017-02-02", 8),
(3, "Friday, Feb 3, 2017", "The biggest story in sports meets the biggest story in politics", 17, "2017-02-03", 8),
(4, "Monday, Feb 6, 2017", "His name is Gary D. Cohn", 20, "2017-02-06", 8),
(5, "Tueday, Feb 7, 2017", "The nomination of Betsy DeVos for Secretary of Education", 20, "2017-02-07", 8);

-- Insert episodes into Science Friday
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "Celebrating '2001: A Space Odyssey' and Whales", "On April 3, 1968, hundreds of audience members walked out of the premier of a sci-fi film", 47, "2018-04-06", 9),
(2, "Levee Wars, New Neurons, Animal Farts", "The mighty Mississippi is shackled and constrained by a series of channels, locks, and levees", 47, "2018-04-07", 9),
(3, "House Science Committee, Superbloom, Snowpack", "There’s been a changing of the guard in the U.S. House of Representative", 48, "2019-03-22", 9),
(4, "How Do Animals Understand Death?", "Throughout history, humans have given a lot of thought to death", 19, "2024-10-24", 9),
(5, "Did Dinosaur Flight Evolve More Than Once?", "The ancient footprints found in South Korea show flight may have evolved in multiple dinosaur lineages", 31, "2024-10-25", 9);

-- Insert episodes into Pardon My Take
INSERT INTO episode (episode_num, name, description, duration, release_date, podcast_id) VALUES
(1, "NBA Finals Live Watch", "We're back in NYC and the NBA Finals are set", 93, "2019-05-28", 10),
(2, "Zac Efron and RJ Hampton", "The Bruins won SCF Game 1 if anyone was still wondering how Tuesday's episode ended", 105, "2019-05-29", 10),
(3, "Comedian Jeff Ross", "NBA Finals Game 1 and Kevin Durant is smiling", 102, "2019-05-31", 10),
(4, "Blake Griffin, NBA Finals", "NBA Finals Game 2 and the Championship Warriors showed up", 95, "2019-06-03", 10),
(5, "Manny Pacquiao", "Kevin Durant is out for Game 3 and Kawhi is the weirdest guy on planet earth", 96, "2019-06-04", 10);

-- Insert Platform to Podcast (each podcast on multiple platforms)
INSERT INTO platform_to_podcast (podcast_id, platform_name) VALUES
(1, 'Spotify'), (1, 'Apple Podcasts'), (1, 'YouTube'), (1, 'Audible'),
(2, 'Spotify'), (2, 'Apple Podcasts'), (2, 'YouTube'), (2, 'Audible'),
(3, 'Spotify'), (3, 'Apple Podcasts'), (3, 'YouTube'), (3, 'Audible'),
(4, 'Spotify'), (4, 'Apple Podcasts'), (4, 'YouTube'), (4, 'Audible'),
(5, 'Spotify'), (5, 'Apple Podcasts'), (5, 'YouTube'), (5, 'Audible'),
(6, 'Spotify'), (6, 'Apple Podcasts'), (6, 'YouTube'), (6, 'Audible'),
(7, 'Spotify'), (7, 'Apple Podcasts'), (7, 'YouTube'), (7, 'Audible'),
(8, 'Spotify'), (8, 'Apple Podcasts'), (8, 'YouTube'), (8, 'Audible'),
(9, 'Spotify'), (9, 'Apple Podcasts'), (9, 'YouTube'), (9, 'Audible'),
(10, 'Spotify'), (10, 'Apple Podcasts'), (10, 'YouTube'), (10, 'Audible');

-- Insert Genre to Podcast
INSERT INTO genre_to_podcast (podcast_id, genre_name) VALUES
(1, 'Comedy'), (1, 'Interview'),
(2, "Business"), (2, "Education"),
(3, "Comedy"), (3, "Interview"),
(4, "Education"), (4, "Technology"),
(5, "Gaming"),
(6, "Health"), (6, "Self-Improvement"),
(7, "History"), (7, "Education"),
(8, "News"), (8, "Interview"),
(9, "Science"), (9, "News"),
(10, "Sports");

-- Insert Episode to Host
INSERT INTO episode_to_host (podcast_id, episode_num, host_id) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1),
(2, 1, 2), (2, 2, 2), (2, 3, 2), (2, 4, 2), (2, 5, 2),
(3, 1, 3), (3, 2, 3), (3, 3, 3), (3, 4, 3), (3, 5, 3),
(4, 1, 4), (4, 2, 4), (4, 3, 4), (4, 4, 4), (4, 5, 4),
(5, 1, 5), (5, 2, 5), (5, 3, 5), (5, 4, 5), (5, 5, 5),
(6, 1, 6), (6, 2, 6), (6, 3, 6), (6, 4, 6), (6, 5, 6),
(7, 1, 7), (7, 2, 7), (7, 3, 7), (7, 4, 7), (7, 5, 7),
(8, 1, 8), (8, 2, 8), (8, 3, 8), (8, 4, 8), (8, 5, 8),
(9, 1, 9), (9, 2, 9), (9, 3, 9), (9, 4, 9), (9, 5, 9),
(10, 1, 10), (10, 2, 10), (10, 3, 10), (10, 4, 10), (10, 5, 10);

-- Insert Episode to Guest
INSERT INTO episode_to_guest (podcast_id, episode_num, guest_id) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 2), (1, 4, 1), (1, 5, 2), (1, 5, 3),
(2, 2, 4), (2, 3, 5), (2, 3, 6), (2, 4, 7), (2, 5, 8),
(3, 1, 9), (3, 2, 10), (3, 3, 11), (3, 4, 12), (3, 5, 13), (3, 5, 14),
(6, 1, 15), (6, 2, 16), (6, 3, 17), (6, 5, 18),
(10, 2, 19), (10, 2, 20), (10, 3, 21), (10, 4, 22), (10, 5, 23);


-- Insert Language to Podcast
INSERT INTO language_to_podcast (podcast_id, language_name) VALUES
(1, 'English'),
(2, 'English'),
(3, 'English'),
(4, 'English'),
(5, 'English'),
(6, 'English'),
(7, 'English'),
(8, 'English'),
(9, 'English'),
(10, 'English');



