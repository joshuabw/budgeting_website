CREATE DATABASE test;

use test;

CREATE TABLE users (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) NOT NULL,
	username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
	date TIMESTAMP
);
