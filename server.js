// Employee Tracker

// require express and inquirer packages
const express = require('express');
const { createPromptModule } = require('inquirer');

const router = require('express').Router();

const inquirer = require('inquirer');
const { connect } = require('./db/connection');

const PORT = 3001;
const app = express();

const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes)


const optionsMenu = () => {
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
            showEmployees();
            break;  

        case 'View Departments':
            showDepartments();
            break;

        case 'View Roles':
            showRoles();
            break;

        case 'Add An Employee':
            addEmployee();
            break;

        case 'Add A Role':
            addRole();
            break;

        case 'Add A Department':
            addDepartment();
            break;

        case 'Update An Employee Role':
            selectEmployee();
            break;

        case 'Delete A Department':
            selectDepartment();
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

// function to view all departments
const showDepartments = () => {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, res) => {
      if (err) throw err
      console.table(res)
      optionsMenu();
    })
  }

// function to view all roles
const showRoles = () => {
const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';

db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    optionsMenu();
})
}

// function to view all employees
const showEmployees= () => {

const sql= `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.dept_name 
FROM employees 
JOIN roles ON employees.role_id = roles.id 
JOIN departments ON roles.dept_id = departments.id 
ORDER BY employees.id;`


    db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    optionsMenu();
    })
}


// functions for all ADD options

// function to add a department to the database
const addDepartment = () => {
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
          optionsMenu();
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
    optionsMenu();
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
      return optionsMenu();
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
  EmployeeArray = []

  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      let employee = `${res[i].first_name} ${res[i].last_name}`
      EmployeeArray.push(employee)
    }
    inquirer.prompt({
      type: 'list',
      name: 'updateEmployee',
      message: 'Which employee would you like to update?',
      choices: EmployeeArray.map(employee => `${employee}`)

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

  // function that actually updates the employee role in the database
  const updateRole = (currentEmployee) => {
    inquirer.prompt({
      type: 'list',
      name: 'confirmUpdate',
      message: 'Are you sure you want to update the role of this employee?',
      choices: ['Confirm update.','Cancel, return to menu.']
    }).then(data => {
      //db.query()
      if(data.confirmUpdate === "Cancel, return to menu."){
        console.log('Update cancelled.')
        optionsMenu();
      }
      if(data.confirmUpdate === "Confirm update."){
        console.log(currentEmployee)
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        const params = [currentEmployee.newRole_id, currentEmployee.id]
        db.query(sql, params, (err, res) => {
          console.log(`${currentEmployee.first_name} ${currentEmployee.last_name} successfully updated to ${currentEmployee.newRole}`)
          optionsMenu();
        })
      }
    })
  }
  
// functions for all DELETE options
let currentDept = {};

// function that allows the user to select the department that they want to delete
const selectDepartment = () => {
    let deptArr = [];
    const sql = `SELECT * FROM departments`;
  
    db.query(sql, (err, res) => {
      if(err) throw err
      for(let i = 0; i < res.length; i++) {
        dept = res[i].dept_name
        deptArr.push(dept)
      }
      inquirer.prompt({
      type: 'list',
      name: 'deleteDepartment',
      message: 'Which department would you like to delete?',
      choices: deptArr.map(dept => `${dept}`)
    })
    .then(chosenDept => {
      currentDept.dept_name = chosenDept.deleteDepartment
  
      const sql = `SELECT id FROM departments WHERE departments.dept_name = ?`;
      const params = [currentDept.dept_name];
      db.query(sql, params, (err, result) => {
        if(err) throw err;
        currentDept.id = result[0].id
        return deleteDepartment(currentDept)
      })
    })
  })
  }

  // function that deletes the selected department
  const deleteDepartment = (dept) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [dept.id];

    db.query(sql, params, (err, result) => {
      if(err) throw err
      console.log(`${dept.dept_name} department successfully deleted.`)
      optionsMenu();
    })
}

// standby roll that will house the role that is to be deleted
roleDelete = {}

// function that allows the user to select a role to delete
const chooseRoleDelete = () => {
let deleteRoleArr = [];

const sql = `SELECT roles.title FROM roles`;
db.query(sql,(req, res) => {
  for(let i = 0; i < res.length; i++){
    role = res[i].title
    deleteRoleArr.push(role)
  }
  inquirer.prompt({
    type: 'list',
    name: 'deleteRole',
    message: 'Which role would you like to delete?',
    choices: deleteRoleArr.map(role => `${role}`)
  }).then(chosenRole => {
    roleDelete.title = chosenRole.deleteRole
    const sql = `SELECT id FROM roles WHERE roles.title = ?`;
    const params = [roleDelete.title]
    db.query(sql, params, (req, result) => {
      roleDelete.id = result[0].id
      return deleteRole(roleDelete)
    })
  })
})
}

// function that deletes the selected role
const deleteRole = (roleDelete) => {
    const sql = `DELETE FROM roles WHERE id = ?`;
    const params = [roleDelete.id]
    db.query(sql, params, (err, res) => {
      if(!res.affectedRows){
        console.log('Role not found')
      }
      console.log(`${roleDelete.title} successfully deleted.`)
      optionsMenu();
    })
  }

// standby employee that will house the employee that is to be deleted
employeeDelete = {}

// function that allows the user to select an employee to delete
const chooseEmployeeDelete = () => {
    let deleteEmployeeArray = [];

    const sql = `SELECT * FROM employees`;
    db.query(sql,(req, res) => {
        for(let i = 0; i < res.length; i++){
            let employee = `${res[i].first_name} ${res[i].last_name}`
            deleteEmployeeArray.push(employee)
        }
        inquirer.prompt({
            type: 'list',
            name: 'deleteEmployee',
            message: 'Which employee would you like to delete?',
            choices: deleteEmployeeArray.map(employee => `${employee}`)
        }).then(employee => {
            let index = employee.deleteEmployee.indexOf(" ")
            employeeDelete.first_name = employee.deleteEmployee.substr(0, index)
            employeeDelete.last_name = employee.deleteEmployee.substr(index + 1)
            
            const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
            const params = [employeeDelete.first_name, employeeDelete.last_name]
            db.query(sql, params, (req, result) => {
            employeeDelete.id = result[0].id
            return deleteEmployee(employeeDelete)
            })
        })
    })
}

// function that deletes the selected employee
const deleteEmployee = () => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const params = [employeeDelete.id]
    db.query(sql, params, (err, res) => {
      if(!res.affectedRows){
        console.log('Employee not found')
      }
      console.log(`${employeeDelete.first_name} ${employeeDelete.last_name} successfully deleted.`)
      optionsMenu();
    })
}

// ERROR catches

// function that responds to requests not found
app.use((req, res) => {
    res.status(404).end();
  })
  
  // function that connects to the server after connecting to the database
  db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      optionsMenu();
    });
  });