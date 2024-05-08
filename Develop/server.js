const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = port.env.PORT || 3001;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'car234car234',
    database: 'company_db',
});

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
          });
    } else if (answers.action == 'View all roles') {
        pool.query('SELECT * FROM roles', function (err, {rows}) {
            console.log(rows);
          });
    } else if (answers.action == 'View all employees') {
        pool.query('SELECT * FROM employees', function (err, {rows}) {
            console.log(rows);
          });
    } else if (answers.action == 'Add a department') {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'department'
            }
        ]).then((departmentAnswers) => {
            pool.query(`INSERT INTO department (name) VALUES $1`, [departmentAnswers.department], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
                console.log(rows);
                console.log('Added department!');
            });
        });
    } else if (answers.action == 'Add a role') {
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
                type: 'input',
                message: 'Which department does the role belong to?',
                name: 'roledepartment'
            }
        ]).then((roleAnswers) => {
            pool.query(`INSERT INTO roles (name) VALUES $1`, [roleAnswers.rolename], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            pool.query(`INSERT INTO roles (salary) VALUES $1`, [roleAnswers.rolesalary], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            pool.query(`INSERT INTO roles (department) VALUES $1`, [roleAnswers.roledepartment], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            console.log(rows);
            console.log('Added role!');
        });
    } else if (answers.action == 'Add an employee') {
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
                choices: []
            },
            {
                type: 'input',
                message: "Who is the employee's manager?",
                name: 'employeemanager'
            }
        ]).then((employeeAnswers) => {
            pool.query(`INSERT INTO employees (first_name) VALUES $1`, [employeeAnswers.firstname], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            pool.query(`INSERT INTO employees (last_name) VALUES $1`, [employeeAnswers.lastname], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            pool.query(`INSERT INTO employees (role_id) VALUES $1`, [employeeAnswers.employeerole], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            pool.query(`INSERT INTO employees (manager_id) VALUES $1`, [employeeAnswers.employeemanager], (err, {rows}) => {
                if (err) {
                  console.log(err);
                }
            });
            console.log(rows);
            console.log('Added employee!');
        });
    } else if (answers.action == 'Update an employee role') {
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                name: 'update',
                choices: []
            }
        ]);
    console.log("Updated employee's role!");
    }
});

pool.connect();

app.listen(PORT, () => {
    console.log('Hey you did it!')
});

findAll