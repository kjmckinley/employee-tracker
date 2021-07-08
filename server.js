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

// Functions to VIEW all user options

// function view all departments
const viewDepartments = () => {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, res) => {
      if (err) throw err
      console.table(res)
      startMenu();
    })
  }

// function to view all roles
const viewRoles = () => {
const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';

db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
})
}

// function to view all employees
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

// functions for all ADD options

// function to add a department to the database
const addDept = () => {
    inquirer.prompt({
        type: 'input',
        name: 'dept_name',
        message: 'What is the name of the new department?'
      })
      .then(newDept => {
        newDept = newDept.dept_name
        const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
        const params = newDept
        db.query(sql, params, (err, result) => {
          if (err) throw err
          //console.table(result)
          console.log(`The ${newDept} department was added successfully.`)
          startMenu();
        })
      })
  }

// function that allows user to add a role to the database
const addRole = () => {
deptArr = []
newRoleData = {}
const sql = `SELECT dept_name FROM departments`;

db.query(sql, (err, res) => {
    for (let i = 0; i < res.length; i++) {
    dept = res[i].dept_name
    deptArr.push(dept)
    }

    // ask user information on new role
    inquirer.prompt([{
    type: 'input',
    name: 'addRole',
    message: 'What is the job title of the role?'
    }, {
    type: 'input',
    name: 'addRoleSalary',
    message: 'What is the salary of the new role?'
    }, {
    type: 'list',
    name: 'deptOfRole',
    message: 'Which department does the new role belong to?',
    choices: deptArr.map(dept => `${dept}`)
    }]).then(dept => {
    newRoleData.newRole = dept.addRole
    newRoleData.newSalary = dept.addRoleSalary
    newRoleData.dept = dept.deptOfRole

    const sql = `SELECT id FROM departments WHERE dept_name = ?`;
    const params = [newRoleData.dept]
    db.query(sql, params, (err, res) => {
        newRoleData.id = res[0].id
        completeAddRole(newRoleData);
    })
    })
})
}

// takes the user input and inserts the new role into the database using mySQL
const completeAddRole = (newRoleData) => {
const sql = `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`;
const params = [newRoleData.newRole, newRoleData.newSalary, newRoleData.id]
db.query(sql, params, (err, res) => {
    if(err) throw err;
    console.log(`${newRoleData.newRole} added successfully!`)
    startMenu();
})
}

// an empty new employee object
newEmployeeData = {};

// function that allows user to add an employee
const addEmployee = () => {
roleArr = []

const sql = `SELECT roles.title FROM roles`;
db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
    role = `${res[i].title}`
    roleArr.push(role)
    }

    // ask user information on new employee
    inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: `Employee's first name:`
    }, {
        type: 'input',
        name: 'last_name',
        message: `Employee's last name:`
    }, {
        type: 'list',
        name: 'title',
        message: 'Select employee role',
        choices: roleArr.map(role => `${role}`)
    }])
    .then(employee => {
        managerArr = [];
        newEmployeeData.first_name = employee.first_name
        newEmployeeData.last_name = employee.last_name
        newEmployeeData.title = employee.title

        const sql = `SELECT id FROM roles WHERE roles.title = ?`
        const params = [newEmployeeData.title]
        db.query(sql, params, (err, res) => {
        newEmployeeData.role_id = res[0].id
        selectManager(newEmployeeData);
        })
    })
})
}  

// a function that inserts user data on new employee into the database
const completeAddEmployee = (newEmployeeData) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES (?,?,?,?)`;
    const params = [newEmployeeData.first_name, newEmployeeData.last_name, newEmployeeData.role_id, newEmployeeData.manager_id]
  
    db.query(sql, params, (err, result) => {
      if (err){
        console.log(err)
      }
      console.log(`New ${newEmployeeData.title}, ${newEmployeeData.first_name} ${newEmployeeData.last_name}, added successfully.`)
      return startMenu();
    })
}

// function to select a manager using the data on employees in the database
const selectManager = (newEmployeeData) => {

    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%Manager%' OR roles.title LIKE '%Director%'`;
  
    db.query(sql, (err, res) => {
      for (let i = 0; i < res.length; i++) {
        manager = `${res[i].first_name} ${res[i].last_name}`, `${res[i].title}`
        managerArr.push(manager)
      }
      inquirer.prompt({
        type: 'list',
        name: 'manager',
        message: 'Select manager',
        choices: managerArr.map(manager => `${manager}`)
      }).then(manager => {
        newEmployeeData.manager = manager.manager
  
        let index = manager.manager.indexOf(" ")
        newEmployeeData.manager_first_name = manager.manager.substr(0, index)
        newEmployeeData.manager_last_name = manager.manager.substr(index + 1)
        const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
        const params = [newEmployeeData.manager_first_name, newEmployeeData.manager_last_name]
        db.query(sql, params, (req, res) => {
          newEmployeeData.manager_id = res[0].id
          completeAddEmployee(newEmployeeData)
        })
      })
    })
  }

// functions for all UPDATE options

// empty current employee to insert into
let currentEmployee = {}

// function that allows user to select the employee they would like to update
const selectEmployee = () => {
  employeeArr = []

  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      let employee = `${res[i].first_name} ${res[i].last_name}`
      employeeArr.push(employee)
    }
    inquirer.prompt({
      type: 'list',
      name: 'updateEmployee',
      message: 'Which employee would you like to update?',
      choices: employeeArr.map(employee => `${employee}`)

    }).then(employee => {
      let index = employee.updateEmployee.indexOf(" ")
      currentEmployee.first_name = employee.updateEmployee.substr(0, index)
      currentEmployee.last_name = employee.updateEmployee.substr(index + 1)

      const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
      const params = [currentEmployee.first_name, currentEmployee.last_name]

      db.query(sql, params, (err, res) => {
        if(err) throw err;
        currentEmployee.id = res[0].id
        chooseRole(currentEmployee)
      })
    })
  })
}

// function that allows user to select a new role for the employee they wish to update
const chooseRole = () => {
    roleArr = []
  
    const sql = `SELECT roles.title FROM roles`;
    db.query(sql, (err, res) => {
      if (err) throw err
      for (let i = 0; i < res.length; i++) {
        role = `${res[i].title}`
        roleArr.push(role)
      }
      inquirer.prompt({
        type: 'list',
        name: 'updateRole',
        message: 'Select new role.',
        choices: roleArr.map(role => `${role}`)
  
      }).then(newRole => {
        currentEmployee.newRole = newRole.updateRole
        
        const sql = `SELECT id FROM roles WHERE roles.title = ?`
        const params = [currentEmployee.newRole]
        db.query(sql, params, (err, res) => {
          if(err) throw err;
          currentEmployee.newRole_id = res[0].id
          updateRole(currentEmployee)
        })
      })
    })
  }