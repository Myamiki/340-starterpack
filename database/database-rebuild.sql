
--CREATE TYPE: account_type_enum
CREATE TYPE account_type_enum AS ENUM ('User', 'Admin', 'Guest');

--CREATE TABLE: account
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    account_type account_type_enum DEFAULT 'User'
);

--CREATE TABLE: classification
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

--CREATE TABLE: inventory
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(200),
    inv_thumbnail VARCHAR(200),
    classification_id INT REFERENCES classification(classification_id)
);

--INSERT DATA: classification
INSERT INTO classification (classification_name)
VALUES
('Sport'),
('Truck'),
('SUV');

--INSERT DATA: inventory
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES
('GM', 'Hummer', 'small interiors, very strong engine', '/images/hummer.jpg', '/images/hummer_thumb.jpg', 3),
('Toyota', 'Supra', 'fast and stylish sports car', '/images/supra.jpg', '/images/supra_thumb.jpg', 1),
('Ford', 'F-150', 'powerful truck with towing', '/images/f150.jpg', '/images/f150_thumb.jpg', 2),
('BMW', 'M3', 'classic sport performance car', '/images/m3.jpg', '/images/m3_thumb.jpg', 1);

--TASK #4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--TASK #6: Update image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
