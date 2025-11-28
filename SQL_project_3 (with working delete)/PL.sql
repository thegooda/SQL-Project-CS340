/*
    CS340
    Project Step 4 Draft: RESET Stored Procedure
    Team Uma Sim: Tom Haney and Philip Nguyen
*/

-- USE `cs340_[insert your id here]` ;
USE `cs340_haneyth` ;

DROP PROCEDURE IF EXISTS `ResetTables`;
DELIMITER //
CREATE PROCEDURE ResetTables()
BEGIN
    -- Most SQL for this procedure taken from the DDL file

    -- Drop tables
    DROP TABLE IF EXISTS `HorsesSparks`;
    DROP TABLE IF EXISTS `RacesHorses`;
    DROP TABLE IF EXISTS `Horses`;
    DROP TABLE IF EXISTS `Support_Cards`;
    DROP TABLE IF EXISTS `Races`;
    DROP TABLE IF EXISTS `Sparks`;

    -- -----------------------------------------------------
    -- Table `Support_Cards`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `Support_Cards` (
    `card_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(65) NOT NULL,
    `stat_boosted` VARCHAR(15) NOT NULL,
    `boost_amount` INT NOT NULL,
    PRIMARY KEY (`card_id`),
    UNIQUE INDEX `idx_card_id_unique` (`card_id` ASC),
    UNIQUE INDEX `idx_card_name_unique` (`name` ASC));

    -- -----------------------------------------------------
    -- Table `Horses`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `Horses` (
    `horse_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(65) NOT NULL,
    `base_speed` INT NOT NULL,
    `base_stamina` INT NOT NULL,
    `base_gut` INT NOT NULL,
    `base_strength` INT NOT NULL,
    `base_wit` INT NOT NULL,
    `style` VARCHAR(25) NOT NULL,
    `preferred_race_distance` VARCHAR(15) NOT NULL,
    `preferred_race_surface` VARCHAR(15) NOT NULL,
    `card_id` INT,
    PRIMARY KEY (`horse_id`),
    UNIQUE INDEX `idx_horse_id_unique` (`horse_id` ASC),
    UNIQUE INDEX `idx_horse_name_unique` (`name` ASC),
    INDEX `idx_fk_horses_card_id` (`card_id` ASC),
    CONSTRAINT `fk_horses_card_id`
        FOREIGN KEY (`card_id`)
        REFERENCES `Support_Cards`(`card_id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE);

    -- -----------------------------------------------------
    -- Table `Races`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `Races` (
    `race_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(65) NOT NULL,
    `surface_type` VARCHAR(15) NOT NULL,
    `distance` VARCHAR(15) NOT NULL,
    PRIMARY KEY (`race_id`),
    UNIQUE INDEX `idx_race_id_unique` (`race_id` ASC),
    UNIQUE INDEX `idx_race_name_unique` (`name` ASC));

    -- -----------------------------------------------------
    -- Table `Sparks`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `Sparks` (
    `spark_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(65) NOT NULL,
    `stat_boosted` VARCHAR(15) NOT NULL,
    `star_amount` INT NOT NULL,
    PRIMARY KEY (`spark_id`),
    UNIQUE INDEX `idx_spark_id_unique` (`spark_id` ASC),
    UNIQUE INDEX `idx_spark_name_unique` (`name` ASC));

    -- -----------------------------------------------------
    -- Table `RacesHorses`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `RacesHorses` (
    `race_horse_id` INT NOT NULL AUTO_INCREMENT,
    `horse_id` INT NOT NULL,
    `race_id` INT NOT NULL,
    INDEX `idx_races_intersect_horses_race_id` (`race_id` ASC),
    INDEX `idx_races_intersect_horses_horse_id` (`horse_id` ASC),
    PRIMARY KEY (`race_horse_id`),
    UNIQUE INDEX `idx_race_horse_id_unique` (`race_horse_id` ASC),
    UNIQUE INDEX `idx_race_horse_pair` (`race_id`, `horse_id` ASC),
    CONSTRAINT `fk_races_intersect_horses_horse_id`
        FOREIGN KEY (`horse_id`)
        REFERENCES `Horses` (`horse_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_races_intersect_horses_race_id`
        FOREIGN KEY (`race_id`)
        REFERENCES `Races` (`race_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

    -- -----------------------------------------------------
    -- Table `HorsesSparks`
    -- -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS `HorsesSparks` (
    `horse_spark_id` INT NOT NULL AUTO_INCREMENT,
    `horse_id` INT NOT NULL,
    `spark_id` INT NOT NULL,
    INDEX `idx_horses_intersect_sparks_spark_id` (`spark_id` ASC),
    INDEX `idx_horses_intersect_sparks_horse_id` (`horse_id` ASC),
    PRIMARY KEY (`horse_spark_id`),
    UNIQUE INDEX `idx_horse_spark_id_unique` (`horse_spark_id` ASC),
    UNIQUE INDEX `idx_horse_spark_pair` (`horse_id`, `spark_id` ASC),
    CONSTRAINT `fk_horses_intersect_sparks_horse_id`
        FOREIGN KEY (`horse_id`)
        REFERENCES `Horses` (`horse_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_horses_intersect_sparks_spark_id`
        FOREIGN KEY (`spark_id`)
        REFERENCES `Sparks` (`spark_id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

    -- Inserts
    INSERT INTO `Support_Cards` VALUES
    (1, 'Beyond This Shining Moment', 'Speed', 47),
    (2, 'Breakaway Battleship', 'Stamina', 52),
    (3, 'Wild Rider', 'Power', 49),
    (4, 'The Brightest Star in Japan!', 'Gut', 55),
    (5, 'Wave of Gratitude', 'Wit', 46);

    INSERT INTO `Horses` VALUES
    (1, 'Admire Groove', 102, 86, 68, 101, 93, 'End closer', 'Medium', 'Turf', 2),
    (2, 'Haru Urara', 83, 58, 86, 89, 84, 'Late surger', 'Short', 'Dirt', 2),
    (3, 'Winning Ticket', 87, 68, 74, 91, 80, 'Late surger', 'Medium', 'Turf', NULL);

    INSERT INTO `Races` VALUES
    (1, 'Chukyo Junior Stakes', 'Turf', 'Mile'),
    (2, 'Oxalis Sho', 'Dirt', 'Short'),
    (3, 'Sumire Stakes', 'Turf', 'Medium'),
    (4, 'Copa Republica Argentina', 'Turf', 'Long'),
    (5, 'Tokyo Daishoten', 'Dirt', 'Medium');

    INSERT INTO `Sparks` VALUES
    (1, 'Sonic Burst', 'Speed', 3),
    (2, 'Sharp Instinct', 'Wit', 2),
    (3, 'Tireless Drive', 'Stamina', 3),
    (4, 'Firm Stance', 'Strength', 1),
    (5, 'Unbreakable Spirit', 'Gut', 2);

    INSERT INTO `RacesHorses` VALUES
    (1, 1, 1),
    (2, 1, 2),
    (3, 2, 3),
    (4, 2, 1),
    (5, 3, 2);

    INSERT INTO `HorsesSparks` VALUES
    (1, 3, 1),
    (2, 2, 2),
    (3, 2, 5),
    (4, 1, 4),
    (5, 1, 1);
END //
DELIMITER ;

-- Populate the Horses table
DROP PROCEDURE IF EXISTS `PopulateHorses`;
DELIMITER //
CREATE PROCEDURE PopulateHorses()
BEGIN
    SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut, 
            h.base_strength, h.base_wit, h.style, h.preferred_race_distance, 
            h.preferred_race_surface, h.card_id, sc.name AS support_card_name
        FROM Horses h
        LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
        ORDER BY h.name;
END //
DELIMITER ;

-- Populate the Races table
DROP PROCEDURE IF EXISTS `PopulateRaces`;
DELIMITER //
CREATE PROCEDURE PopulateRaces()
BEGIN
    SELECT race_id, name, surface_type, distance
      FROM Races
      ORDER BY name;
END //
DELIMITER ;

-- Populate the Support_Cards table
DROP PROCEDURE IF EXISTS `PopulateSupportCards`;
DELIMITER //
CREATE PROCEDURE PopulateSupportCards()
BEGIN
    SELECT card_id, name, stat_boosted, boost_amount
      FROM Support_Cards
      ORDER BY name;
END //
DELIMITER ;

-- Populate the Sparks table
DROP PROCEDURE IF EXISTS `PopulateSparks`;
DELIMITER //
CREATE PROCEDURE PopulateSparks()
BEGIN
    SELECT spark_id, name, stat_boosted, star_amount
      FROM Sparks
      ORDER BY name;
END //
DELIMITER ;

-- Populate the RacesHorses table
DROP PROCEDURE IF EXISTS `PopulateRacesHorses`;
DELIMITER //
CREATE PROCEDURE PopulateRacesHorses()
BEGIN
    SELECT rh.race_horse_id, rh.horse_id, h.name AS horse_name,
            rh.race_id, r.name AS race_name,
            r.surface_type, r.distance
    FROM RacesHorses rh
    JOIN Horses h ON rh.horse_id = h.horse_id
    JOIN Races r ON rh.race_id = r.race_id
    ORDER BY rh.race_horse_id;
END //
DELIMITER ;

-- Populate the HorsesSparks table
DROP PROCEDURE IF EXISTS `PopulateHorsesSparks`;
DELIMITER //
CREATE PROCEDURE PopulateHorsesSparks()
BEGIN
    SELECT hs.horse_spark_id, 
            h.horse_id, h.name AS horse_name, 
            s.spark_id, s.name AS spark_name,
            s.stat_boosted, s.star_amount
        FROM HorsesSparks hs
        JOIN Horses h ON hs.horse_id = h.horse_id
        JOIN Sparks s ON hs.spark_id = s.spark_id
        ORDER BY h.name, s.name;
END //
DELIMITER ;

-- SELECT a specific horse's data by id
DROP PROCEDURE IF EXISTS `GetHorseById`;
DELIMITER //
CREATE PROCEDURE GetHorseById(IN horse_id_input INT)
BEGIN
    SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut, 
            h.base_strength, h.base_wit, h.style, h.preferred_race_distance, 
            h.preferred_race_surface, h.card_id, sc.name AS support_card_name
        FROM Horses h
        LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
        WHERE h.horse_id = horse_id_input;
END //
DELIMITER ;

-- SELECT a specific race's data by id
DROP PROCEDURE IF EXISTS `GetRaceById`;
DELIMITER //
CREATE PROCEDURE GetRaceById(IN race_id_input INT)
BEGIN
    SELECT * FROM Races WHERE race_id = race_id_input;
END //
DELIMITER ;

-- SELECT a specific support card's data by id
DROP PROCEDURE IF EXISTS `GetSupportCardById`;
DELIMITER //
CREATE PROCEDURE GetSupportCardById(IN card_id_input INT)
BEGIN
    SELECT * FROM Support_Cards WHERE card_id = card_id_input;
END //
DELIMITER ;

-- SELECT a specific spark's data by id
DROP PROCEDURE IF EXISTS `GetSparkById`;
DELIMITER //
CREATE PROCEDURE GetSparkById(IN spark_id_input INT)
BEGIN
    SELECT * FROM Sparks WHERE spark_id = spark_id_input;
END //
DELIMITER ;

-- SELECT just a specific RacesHorses entry by id
DROP PROCEDURE IF EXISTS `GetRacesHorsesById`;
DELIMITER //
CREATE PROCEDURE GetRacesHorsesById(IN race_horse_id_input INT)
BEGIN
    SELECT * FROM RacesHorses WHERE race_horse_id = race_horse_id_input;
END //
DELIMITER ;

-- SELECT RaceHorses as well as Horse and Race data by race_horse_id
DROP PROCEDURE IF EXISTS `GetRacesHorsesDetailsById`;
DELIMITER //
CREATE PROCEDURE GetRacesHorsesDetailsById(IN race_horse_id_input INT)
BEGIN
    SELECT rh.race_horse_id, rh.horse_id, h.name AS horse_name,
            rh.race_id, r.name AS race_name
        FROM RacesHorses rh
        JOIN Horses h ON rh.horse_id = h.horse_id
        JOIN Races r ON rh.race_id = r.race_id
        WHERE rh.race_horse_id = race_horse_id_input;
END //
DELIMITER ;

-- SELECT just a specific HorsesSparks entry by id
DROP PROCEDURE IF EXISTS `GetHorsesSparksById`;
DELIMITER //
CREATE PROCEDURE GetHorsesSparksById(IN horse_spark_id_input INT)
BEGIN
    SELECT * FROM HorsesSparks WHERE horse_spark_id = horse_spark_id_input;
END //
DELIMITER ;

-- SELECT HorsesSparks as well as Horse and Spark data by horse_spark_id
DROP PROCEDURE IF EXISTS `GetHorsesSparksDetailsById`;
DELIMITER //
CREATE PROCEDURE GetHorsesSparksDetailsById(IN horse_spark_id_input INT)
BEGIN
    SELECT hs.horse_spark_id, hs.horse_id, hs.spark_id, 
            h.name AS horse_name, s.name AS spark_name
        FROM HorsesSparks hs
        JOIN Horses h ON hs.horse_id = h.horse_id
        JOIN Sparks s ON hs.spark_id = s.spark_id
        WHERE hs.horse_spark_id = horse_spark_id_input;
END //
DELIMITER ;

-- DELETE a Horse by ID
DROP PROCEDURE IF EXISTS `DeleteHorseById`;
DELIMITER //
CREATE PROCEDURE DeleteHorseById(IN horse_id_input INT)
BEGIN
    DELETE FROM Horses WHERE horse_id = horse_id_input;
END //
DELIMITER ;

-- DELETE a Race by ID
DROP PROCEDURE IF EXISTS `DeleteRaceById`;
DELIMITER //
CREATE PROCEDURE DeleteRaceById(IN race_id_input INT)
BEGIN
    DELETE FROM Races WHERE race_id = race_id_input;
END //
DELIMITER ;

-- DELETE a Support Card by ID
DROP PROCEDURE IF EXISTS `DeleteSupportCardById`;
DELIMITER //
CREATE PROCEDURE DeleteSupportCardById(IN card_id_input INT)
BEGIN
    DELETE FROM Support_Cards WHERE card_id = card_id_input;
END //
DELIMITER ;

-- DELETE a Spark by ID
DROP PROCEDURE IF EXISTS `DeleteSparkById`;
DELIMITER //
CREATE PROCEDURE DeleteSparkById(IN spark_id_input INT)
BEGIN
    DELETE FROM Sparks WHERE spark_id = spark_id_input;
END //
DELIMITER ;

-- DELETE a RacesHorses entry by ID
DROP PROCEDURE IF EXISTS `DeleteRacesHorsesById`;
DELIMITER //
CREATE PROCEDURE DeleteRacesHorsesById(IN race_horse_id_input INT)
BEGIN
    DELETE FROM RacesHorses WHERE race_horse_id = race_horse_id_input;
END //
DELIMITER ;

-- DELETE a HorsesSparks entry by ID
DROP PROCEDURE IF EXISTS `DeleteHorsesSparksById`;
DELIMITER //
CREATE PROCEDURE DeleteHorsesSparksById(IN horse_spark_id_input INT)
BEGIN
    DELETE FROM HorsesSparks WHERE horse_spark_id = horse_spark_id_input;
END //
DELIMITER ;