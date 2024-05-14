const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'car234car234',
    database: 'company_db',
});

function viewDepartments() {
    pool.query('SELECT * FROM departments;', function (err, {rows}) {
        console.table(rows);
        loadMainPrompts();
    })
}

function viewRoles() {
    pool.query('SELECT roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department = departments.id;', function (err, {rows}) {
        console.table(rows);
        loadMainPrompts();
    })
}

function viewEmployees() {
    pool.query('SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary AS salary, employees.manager FROM employees JOIN roles ON employees.role_id = roles.id;', function (err, {rows}) {
        console.table(rows);
        loadMainPrompts();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'department'
        }
    ]).then((departmentAnswers) => {
        pool.query(`INSERT INTO departments (name) VALUES ('${departmentAnswers.department}')`, (err) => {
            if (err) {
              console.log(err);
            } else {
            console.log('Department added successfully!');
            loadMainPrompts();
            }
        });
    });
}

function addRole() {
    pool.query('SELECT * FROM departments')
    .then(({ rows }) => {
        const departmentChoices = rows.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
        return inquirer.prompt([
            {
                type: 'input',
                message: 'What is the title of the role?',
                name: 'rolename',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'rolesalary',
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'roledepartment',
                choices: departmentChoices,
            },
        ]);
    })
    .then((roleAnswers) => {
        const queryText = 'INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)';
        const values = [roleAnswers.rolename, roleAnswers.rolesalary, roleAnswers.roledepartment];
        return pool.query(queryText, values);
    })
    .then(() => {
        console.log('Role added successfully!');
        loadMainPrompts();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}

function addEmployee() {
    Promise.all([
        pool.query('SELECT * FROM roles'),
        pool.query('SELECT * FROM employees')
    ]).then(([rolesResult, employeesResult]) => {
        const roleChoices = rolesResult.rows.map(({ id, title }) => ({
            name: title,
            value: id
        }));
        const managerChoices = employeesResult.rows.map(({ first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: `${first_name} ${last_name}`
        }));
        managerChoices.unshift({
            name: `None`,
            value: `None`
        });
            return inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'firstname'
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'lastname'
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'employeerole',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'manager',
                    choices: managerChoices
                }
            ])
    })
    .then((employeeAnswers) => {
        const queryText = 'INSERT INTO employees (first_name, last_name, role_id, manager) VALUES ($1, $2, $3, $4)';
        const values = [employeeAnswers.firstname, employeeAnswers.lastname, employeeAnswers.employeerole, employeeAnswers.manager];
        return pool.query(queryText, values);
    })
    .then(() => {
        console.log('Employee added successfully!');
        loadMainPrompts();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}

function updateEmployeeRole() {
    Promise.all([
        pool.query('SELECT * FROM roles'),
        pool.query('SELECT * FROM employees')
    ]).then(([rolesResult, employeesResult]) => {
        const roleChoices = rolesResult.rows.map(({ id, title }) => ({
            name: title,
            value: id
        }));
        const employeeChoices = employeesResult.rows.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
            return inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    name: 'updateEmployee',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    message: "Which role do you want to assign to the selected employee?",
                    name: 'updateRole',
                    choices: roleChoices
                }
            ])
    })
    .then((updateAnswers) => {
        const queryText = "UPDATE employees SET role_id = $1 WHERE id = $2";
        const values = [updateAnswers.updateRole, updateAnswers.updateEmployee];
        return pool.query(queryText, values);
    })
    .then(() => {
        console.log('Employee updated successfully!');
        loadMainPrompts();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}

function loadMainPrompts() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        }
    ]).then((answers) => {
        if (answers.action == 'View all departments') {
            viewDepartments();
        } else if (answers.action == 'View all roles') {
            viewRoles();
        } else if (answers.action == 'View all employees') {
            viewEmployees();
        } else if (answers.action == 'Add a department') {
            addDepartment();
        } else if (answers.action == 'Add a role') {
            addRole();
        } else if (answers.action === 'Add an employee') {
            addEmployee();
        } else if (answers.action == 'Update an employee role') {
            updateEmployeeRole();
        }
    })
}

pool.connect();

app.listen(PORT, () => {
    loadMainPrompts();
});