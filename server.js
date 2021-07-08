// Employee Tracker

// require express and inquirer packages
const express = require('express');
const { createPromptModule } = require('inquirer');

const router = require('express').Router();

const inquirer = require('inquirer');
const { connect } = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes)


const startMenu = () => {
  inquirer.prompt({
    type: 'list',
    name: 'selectAction',
    message: 'What would you like to do?',
    choices: [
              'View Employees',
              'View Departments', 
              'View Roles', 
              'Add An Employee',
              'Add A Role', 
              'Add A Department', 
              'Update An Employee Role', 
              'Delete A Department', 
              'Delete A Role', 
              'Delete An Employee'
            ]
  })

  .then(action => {
        action = action.selectAction

        switch (action) {

        case 'View Employees':
            viewEmployees();
            break;  

        case 'View Departments':
            viewDepartments();
            break;

        case 'View Roles':
            viewRoles();
            break;

        case 'Add An Employee':
            addEmployee();
            break;

        case 'Add A Role':
            addRole();
            break;

        case 'Add A Department':
            addDept();
            break;

        case 'Update An Employee Role':
            selectEmployee();
            break;

        case 'Delete A Department':
            selectDept();
            break;

        case 'Delete A Role':
            chooseRoleDelete();
            break;

        case 'Delete An Employee':
            chooseEmployeeDelete();
            break;
        }
    })
}

// Functions to view all user options

const viewDepartments = () => {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, res) => {
      if (err) throw err
      console.table(res)
      startMenu();
    })
  }

  const viewRoles = () => {
    const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';
    
    db.query(sql, (err, res) => {
      if (err) throw err
      console.table(res)
      startMenu();
    })
  }

  const viewEmployees= () => {

    const sql= `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.dept_name 
    FROM employees 
    JOIN roles ON employees.role_id = roles.id 
    JOIN departments ON roles.dept_id = departments.id 
    ORDER BY employees.id;`
    
    
      db.query(sql, (err, res) => {
        if (err) throw err
        console.table(res)
        startMenu();
      })
    }