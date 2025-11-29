/*
  CS340
  Project Step 2 Draft: DDL with Sample Insertions
  Team Uma Sim: Tom Haney and Philip Nguyen

  Below CREATE TABLE statements all adopted from the "Forward Engineering" feature included with MySQL Workbench.

  Changes were made to the CONSTRAINT sections for defining foreign keys, namely in the ON DELETE and ON UPDATE behaviors.
  
  Constraints and indexes were also renamed to be more clear / more consistent with snake_case from what they were automatically named by MySQL Workbench.

  `cs340_haneyth` was removed from CREATE TABLE statements to allow more flexibility for other students to test. Comments updated accordingly as well.

  INSERT statements were hand-written.
*/

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- USE `cs340_[insert your id here]` ;
USE `cs340_haneyth` ;

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
  UNIQUE INDEX `idx_card_name_unique` (`name` ASC))
ENGINE = InnoDB;


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
    ON UPDATE CASCADE)
ENGINE = InnoDB;


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
  UNIQUE INDEX `idx_race_name_unique` (`name` ASC))
ENGINE = InnoDB;


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
    ON UPDATE CASCADE)
ENGINE = InnoDB;


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
  UNIQUE INDEX `idx_spark_name_unique` (`name` ASC))
ENGINE = InnoDB;


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
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Below INSERT statements written by hand. Everything above this line up to the top comment adapted from MySQL Workbench output.

INSERT INTO `Support_Cards` VALUES
  (1, 'Beyond This Shining Moment', 'Speed', 47),
  (2, 'Breakaway Battleship', 'Stamina', 52),
  (3, 'Wild Rider', 'Strength', 49),
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
