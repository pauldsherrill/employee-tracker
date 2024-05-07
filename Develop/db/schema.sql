DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c employees;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL,
    department INTEGER,
    FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id: SERIAL PRIMARY KEY
    first_name: VARCHAR(30) NOT NULL,
    last_name: VARCHAR(30) NOT NULL,
    role_id: INTEGER NOT NULL,
    manager_id: INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
);