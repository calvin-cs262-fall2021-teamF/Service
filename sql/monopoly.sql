-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS PlayerGame;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;

-- Create the schema.
CREATE TABLE User (
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
	userId integer REFERENCES User(ID),
	time integer
	);

-- Allow users to select data from the tables.
GRANT SELECT ON User TO PUBLIC;
GRANT SELECT ON Logs TO PUBLIC;

-- Add sample records.
INSERT INTO User VALUES (1, 'j_doe', 'John Doe', 'j_doe@gmail.com', 'johndoe', 120, 2);
INSERT INTO User VALUES (2, 'a_doe', 'A Doe', 'a_doe@gmail.com', 'adoe', 60, 1);
INSERT INTO User VALUES (3, 'b_doe', 'B Doe', 'b_doe@gmail.com', 'bdoe', 80, 3);

INSERT INTO Logs VALUES (1, 1, 100);
INSERT INTO Logs VALUES (2, 2, 90);
INSERT INTO Logs VALUES (3, 3, 80);
