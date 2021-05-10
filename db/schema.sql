CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roll_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id)
);