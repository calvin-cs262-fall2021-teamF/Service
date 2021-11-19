-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Logs;

-- Create the schema.
CREATE TABLE Users(
	ID SERIAL PRIMARY KEY,
	username varchar(30) NOT NULL,
	name varchar(50),
	email varchar(50),
	password varchar(50),
	timeGoal integer,
	freqGoal integer
	);

CREATE TABLE Logs (
	ID SERIAL PRIMARY KEY,
	userId integer REFERENCES Users(ID),
	brushDate date,
	duration integer
	);

-- Allow users to select data from the tables.
GRANT SELECT ON Users TO PUBLIC;
GRANT SELECT ON Logs TO PUBLIC;

-- Add sample records.
INSERT INTO Users VALUES (1, 'j_doe', 'John Doe', 'j_doe@gmail.com', 'johndoe', 120, 2);
INSERT INTO Users VALUES (2, 'a_doe', 'A Doe', 'a_doe@gmail.com', 'adoe', 60, 1);
INSERT INTO Users VALUES (3, 'b_doe', 'B Doe', 'b_doe@gmail.com', 'bdoe', 80, 3);

INSERT INTO Logs VALUES (1, 1, 2020-03-22, 100);
INSERT INTO Logs VALUES (2, 2, 2021-11-01, 90);
INSERT INTO Logs VALUES (3, 3, 2021-11-18, 80);
