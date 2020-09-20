DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department
(
    id   INT         NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(30) NULL
);

CREATE TABLE role
(
    id            INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    title         VARCHAR(30),
    salary        DECIMAL(10, 2),
    department_id INT,
    CONSTRAINT FOREIGN KEY (department_id)
        REFERENCES department (id) ON DELETE CASCADE
);

CREATE TABLE employee
(
    id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    first_name VARCHAR(30),
    last_name  VARCHAR(30),
    role_id    INT,
    manager_id INT,
    CONSTRAINT FOREIGN KEY (role_id)
        REFERENCES role (id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (manager_id)
        REFERENCES employee (id) ON DELETE CASCADE

);
