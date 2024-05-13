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
            pool.query('SELECT * FROM departments', function (err, {rows}) {
                console.log(rows);
                loadMainPrompts();
              })
        } else if (answers.action == 'View all roles') {
            pool.query('SELECT roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department = departments.id;', function (err, {rows}) {
                console.log(rows);
                loadMainPrompts();
              });
        } else if (answers.action == 'View all employees') {
            pool.query('SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary AS salary, employees.manager FROM employees JOIN roles ON employees.role_id = roles.id;', function (err, {rows}) {
                console.log(rows);
                loadMainPrompts();
              });
        } else if (answers.action == 'Add a department') {
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
                    console.log('Added department!');
                    loadMainPrompts();
                    }
                });
            });
        } else if (answers.action == 'Add a role') {
            pool.query('SELECT * FROM departments', function (err, {rows}) {
                const departmentChoices = rows.map(({ id, name }) => ({
                  name: name,
                  value: id,
                }));
                return departmentChoices
            }).then((departmentChoices) => {
                inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the role?',
                    name: 'rolename'
                },
                {
                    type: 'input',
                    message: 'What is the salary of the role?',
                    name: 'rolesalary'
                },
                {
                    type: 'list',
                    message: 'Which department does the role belong to?',
                    name: 'roledepartment',
                    choices: departmentChoices
                }
            ])}).then((roleAnswers) => {
                pool.query(`INSERT INTO roles (name) VALUES ('${roleAnswers.rolename}', '${roleAnswers.rolesalary}', '${roleAnswers.roledepartment}')`, (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
                console.log('Added role!');
            });
        } else if (answers.action == 'Add an employee') {
            pool.query('SELECT * FROM roles', function (err, {rows}) {
                const roleChoices = rows.map(({ id, title }) => ({
                  name: title,
                  value: id,
                }));
                return roleChoices;
            });
            pool.query('SELECT * FROM employees', function (err, {rows}) {
                const managerChoices = rows.map(({ manager }) => ({
                    name: manager,
                }));
            return managerChoices;
            }).then((roleChoices) => {
            inquirer.prompt([
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
                    type: 'input',
                    message: "Who is the employee's manager?",
                    name: 'employeemanager'
                }
            ])}).then((employeeAnswers) => {
                pool.query(`INSERT INTO employees (first_name) VALUES $1`, [employeeAnswers.firstname], (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
                pool.query(`INSERT INTO employees (last_name) VALUES $1`, [employeeAnswers.lastname], (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
                pool.query(`INSERT INTO employees (role_id) VALUES $1`, [employeeAnswers.employeerole], (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
                pool.query(`INSERT INTO employees (manager_id) VALUES $1`, [employeeAnswers.employeemanager], (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
                console.log('Added employee!');
            });
        } else if (answers.action == 'Update an employee role') {
            pool.query('SELECT * FROM employees', function (err, {rows}) {
                const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
                  name: first_name + last_name,
                  value: id,
                }));
                return employeeChoices;
            })
            pool.query('SELECT * FROM roles', function (err, {rows}) {
                const roleChoices = rows.map(({ id, title }) => ({
                  name: title,
                  value: id,
                }));
                return roleChoices
            }).then((employeeChoices) => {
            inquirer.prompt([
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
                },
            ])});
        console.log("Updated employee's role!");
        }
    });
}

pool.connect();

app.listen(PORT, () => {
    loadMainPrompts();
});