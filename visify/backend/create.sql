CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL,      
  fullname varchar(70) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(id) /* A game's unique primary key consists of the visitor_name & the game date (this assumes you can't have multiple games against the same team in a single day) */
);