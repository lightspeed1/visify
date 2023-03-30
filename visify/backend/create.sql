CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL,      
  fullname varchar(70) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(id)
);