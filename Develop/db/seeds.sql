INSERT INTO departments (name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO roles (title, salary, department)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 75000, 1),
       ('Lead Engineer', 120000, 2),
       ('Software Engineer', 90000, 2),
       ('Account Manager', 110000, 3),
       ('Accountant', 80000, 3),
       ('Legal Team Lead', 90000, 4),
       ('Lawyer', 150000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager)
VALUES  ('Jim', 'Halpert', 1, 'None'),
        ('Dwight', 'Schrute', 2, 'Jim Halpert'),
        ('Ashley', 'Rodriguez', 3, 'None'),
        ('Kevin', 'Tupik', 4, 'Ashley Rodriguez'),
        ('Oscar', 'Martinez', 5, 'None'),
        ('Kevin', 'Malone', 6, 'Oscar Martinez');

SELECT * FROM departments;

SELECT roles.title, departments.name AS department, roles.salary
FROM roles
JOIN departments ON roles.department = departments.id;

SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary AS salary, employees.manager
FROM employees
JOIN roles ON employees.role_id = roles.id;