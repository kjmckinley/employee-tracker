// Employee Tracker

// require mysql and inquirer packages
const mysql = require('mysql');
const inquirer = require('inquirer');

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3001,

    // Your username
    user: 'root',

    // Your password
    password: 'yourPasswordHere',
    database: 'employee_db'
});

connection.connect(function(err) {
    if(err) throw err;
    menuPrompt();

});

function menuPrompt() {
    inquirer.prompt({
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Employee Roles",
            "View Employee Departments",
            "Add an Employee",
            "Add an Employee Role",
            "Update Employee Role",
            "Add a Department",
            "Remove Employee",
            "EXIT"
        ]
    })

    .then(function(response) {
        if (response.task === 'View Employees') {
            viewEmployees();
        }
        else if (response.task === 'View Employee Roles') {
            viewEmployeeRoles();
        }
        else if (response.task === 'View Employee Departments') {
            viewEmployeeDepartments();
        }
        else if (response.task === 'Add an Employee') {
            addEmployee();
        }
        else if (response.task === 'Add an Employee Role') {
            addEmployeeRole();
        }
        else if (response.task === 'Update Employee Role') {
            updateEmployeeRole();
        }
        else if (response.task === 'Add a Department') {
            addDepartment();
        }
        else if (response.task === 'Remove Employee') {
            removeEmployee();
        }
        else if (response.task === 'EXIT') {
            connection.end();
        }
    })

}
