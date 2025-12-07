-- CS340 Project - Data Manipulation Queries (DML)
-- Team Uma Sim: Tom Haney and Philip Nguyen
-- Horse Racing Database

-- Variable notation: We use :variableName to denote variables that will be 
-- replaced with actual values from the backend code

-- =============================================
-- HORSES QUERIES
-- =============================================

-- Get all horses for browse page with support card name
SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut, 
       h.base_strength, h.base_wit, h.style, h.preferred_race_distance, 
       h.preferred_race_surface, sc.name AS support_card_name
FROM Horses h
LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
ORDER BY h.name;

-- Search horses by name
SELECT h.horse_id, h.name, h.base_speed, h.base_stamina, h.base_gut, 
       h.base_strength, h.base_wit, h.style, h.preferred_race_distance, 
       h.preferred_race_surface, sc.name AS support_card_name
FROM Horses h
LEFT JOIN Support_Cards sc ON h.card_id = sc.card_id
WHERE h.name LIKE CONCAT('%', :searchTerm, '%')
ORDER BY h.name;

-- Get a single horse by ID for edit page
SELECT horse_id, name, base_speed, base_stamina, base_gut, base_strength, 
       base_wit, style, preferred_race_distance, preferred_race_surface, card_id
FROM Horses
WHERE horse_id = :horse_id_selected;

-- Add a new horse
INSERT INTO Horses (name, base_speed, base_stamina, base_gut, base_strength, 
                    base_wit, style, preferred_race_distance, preferred_race_surface, card_id)
VALUES (:nameInput, :base_speedInput, :base_staminaInput, :base_gutInput, 
        :base_strengthInput, :base_witInput, :styleInput, :preferred_race_distanceInput, 
        :preferred_race_surfaceInput, :card_idInput);

-- Update a horse
UPDATE Horses
SET name = :nameInput,
    base_speed = :base_speedInput,
    base_stamina = :base_staminaInput,
    base_gut = :base_gutInput,
    base_strength = :base_strengthInput,
    base_wit = :base_witInput,
    style = :styleInput,
    preferred_race_distance = :preferred_race_distanceInput,
    preferred_race_surface = :preferred_race_surfaceInput,
    card_id = :card_idInput
WHERE horse_id = :horse_id_selected;

-- Delete a horse
DELETE FROM Horses WHERE horse_id = :horse_id_selected;

-- =============================================
-- RACES QUERIES
-- =============================================

-- Get all races for browse page
SELECT race_id, name, surface_type, distance
FROM Races
ORDER BY name;

-- Search races by name
SELECT race_id, name, surface_type, distance
FROM Races
WHERE name LIKE CONCAT('%', :searchTerm, '%')
ORDER BY name;

-- Get a single race by ID for edit page
SELECT race_id, name, surface_type, distance
FROM Races
WHERE race_id = :race_id_selected;

-- Add a new race
INSERT INTO Races (name, surface_type, distance)
VALUES (:nameInput, :surface_typeInput, :distanceInput);

-- Update a race
UPDATE Races
SET name = :nameInput,
    surface_type = :surface_typeInput,
    distance = :distanceInput
WHERE race_id = :race_id_selected;

-- Delete a race
DELETE FROM Races WHERE race_id = :race_id_selected;

-- =============================================
-- SUPPORT CARDS QUERIES
-- =============================================

-- Get all support cards for browse page
SELECT card_id, name, stat_boosted, boost_amount
FROM Support_Cards
ORDER BY name;

-- Get all support cards for dropdown (used in horse add/edit forms)
SELECT card_id, name
FROM Support_Cards
ORDER BY name;

-- Search support cards by name
SELECT card_id, name, stat_boosted, boost_amount
FROM Support_Cards
WHERE name LIKE CONCAT('%', :searchTerm, '%')
ORDER BY name;

-- Get a single support card by ID for edit page
SELECT card_id, name, stat_boosted, boost_amount
FROM Support_Cards
WHERE card_id = :card_id_selected;

-- Add a new support card
INSERT INTO Support_Cards (name, stat_boosted, boost_amount)
VALUES (:nameInput, :stat_boostedInput, :boost_amountInput);

-- Update a support card
UPDATE Support_Cards
SET name = :nameInput,
    stat_boosted = :stat_boostedInput,
    boost_amount = :boost_amountInput
WHERE card_id = :card_id_selected;

-- Delete a support card (will set horse card_id to NULL due to ON DELETE SET DEFAULT)
DELETE FROM Support_Cards WHERE card_id = :card_id_selected;

-- =============================================
-- SPARKS QUERIES
-- =============================================

-- Get all sparks for browse page
SELECT spark_id, name, stat_boosted, star_amount
FROM Sparks
ORDER BY name;

-- Get all sparks for dropdown (used in horses-sparks M:N)
SELECT spark_id, name
FROM Sparks
ORDER BY name;

-- Search sparks by name
SELECT spark_id, name, stat_boosted, star_amount
FROM Sparks
WHERE name LIKE CONCAT('%', :searchTerm, '%')
ORDER BY name;

-- Get a single spark by ID for edit page
SELECT spark_id, name, stat_boosted, star_amount
FROM Sparks
WHERE spark_id = :spark_id_selected;

-- Add a new spark
INSERT INTO Sparks (name, stat_boosted, star_amount)
VALUES (:nameInput, :stat_boostedInput, :star_amountInput);

-- Update a spark
UPDATE Sparks
SET name = :nameInput,
    stat_boosted = :stat_boostedInput,
    star_amount = :star_amountInput
WHERE spark_id = :spark_id_selected;

-- Delete a spark
DELETE FROM Sparks WHERE spark_id = :spark_id_selected;

-- =============================================
-- RACESHORSES (M:N RELATIONSHIP) QUERIES
-- =============================================

-- Get all race entries with horse and race names
SELECT rh.race_horse_id, h.name AS horse_name, r.name AS race_name,
       r.surface_type, r.distance
FROM RacesHorses rh
JOIN Horses h ON rh.horse_id = h.horse_id
JOIN Races r ON rh.race_id = r.race_id
ORDER BY r.name, h.name;

-- Get all horses entered in a specific race
SELECT h.horse_id, h.name, h.style, h.preferred_race_distance, 
       h.preferred_race_surface, rh.race_horse_id
FROM RacesHorses rh
JOIN Horses h ON rh.horse_id = h.horse_id
WHERE rh.race_id = :race_id_selected
ORDER BY h.name;

-- Get all races a specific horse is entered in
SELECT r.race_id, r.name, r.surface_type, r.distance, rh.race_horse_id
FROM RacesHorses rh
JOIN Races r ON rh.race_id = r.race_id
WHERE rh.horse_id = :horse_id_selected
ORDER BY r.name;

-- Add a horse to a race (enter horse in race)
INSERT INTO RacesHorses (horse_id, race_id)
VALUES (:horse_id_from_dropdown, :race_id_from_dropdown);

-- Remove a horse from a race
DELETE FROM RacesHorses 
WHERE race_horse_id = :race_horse_id_selected;

-- Alternative: Remove a horse from a specific race
DELETE FROM RacesHorses 
WHERE horse_id = :horse_id_selected AND race_id = :race_id_selected;

-- =============================================
-- HORSESSPARKS (M:N RELATIONSHIP) QUERIES
-- =============================================

-- Get all horse-spark assignments with names
SELECT hs.horse_spark_id, h.name AS horse_name, s.name AS spark_name,
       s.stat_boosted, s.star_amount
FROM HorsesSparks hs
JOIN Horses h ON hs.horse_id = h.horse_id
JOIN Sparks s ON hs.spark_id = s.spark_id
ORDER BY h.name, s.name;

-- Get all sparks assigned to a specific horse
SELECT s.spark_id, s.name, s.stat_boosted, s.star_amount, hs.horse_spark_id
FROM HorsesSparks hs
JOIN Sparks s ON hs.spark_id = s.spark_id
WHERE hs.horse_id = :horse_id_selected
ORDER BY s.name;

-- Get all horses that have a specific spark
SELECT h.horse_id, h.name, h.style, hs.horse_spark_id
FROM HorsesSparks hs
JOIN Horses h ON hs.horse_id = h.horse_id
WHERE hs.spark_id = :spark_id_selected
ORDER BY h.name;

-- Assign a spark to a horse
INSERT INTO HorsesSparks (horse_id, spark_id)
VALUES (:horse_id_from_dropdown, :spark_id_from_dropdown);

-- Remove a spark from a horse
DELETE FROM HorsesSparks 
WHERE horse_spark_id = :horse_spark_id_selected;

-- Alternative: Remove a specific spark from a specific horse
DELETE FROM HorsesSparks 
WHERE horse_id = :horse_id_selected AND spark_id = :spark_id_selected;