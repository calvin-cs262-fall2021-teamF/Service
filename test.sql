-- CREATE DATABASE test;

CREATE TABLE user (
    ID int PRIMARY KEY, 
    name varchar(20), 
    email varchar(30),
    password varchar(100)
);

INSERT INTO user (1, 'Jon', 'jondoe@gmail.com', 'password');

SELECT * FROM user;