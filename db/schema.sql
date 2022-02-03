DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

use company_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30), 
    salary DECIMAL(10,2),
    department_id INT, 
    FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30), 
    last_name VARCHAR(30), 
    role_id INT, 
    manager_id INT DEFAULT NULL,
    FOREIGN KEY(role_id) REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY(manager_id) REFERENCES employees(id)
    ON DELETE SET NULL
);