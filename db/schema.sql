-- Employee Tracker

-- initiallizes a database called employee_db
CREATE DATABASE employee_db;

USE employee_db;

-- creates a table that holds information for employee
CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id)

    FOREIGN KEY(role_id)
    REFERENCES role(id),

    FOREIGN KEY(manager_id)
    REFERENCES employee(id)
);

-- creates a table that holds information for employee roles
CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(6,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),

    FOREIGN KEY(department_id)
    REFERENCES department(id)
);

-- creates a table that holds information for departments
CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id) 
);