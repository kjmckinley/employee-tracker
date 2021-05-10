// Employee Tracker

// require mysql and inquirer packages
const mysql = require('mysql');
const inquirer = require('inquirer');

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port
    port: 3001,

    // Your username
    user: 'root',

    // Your password
    password: 'password',
    database: 'employee_db'
});

// if there are no errors, start the connection of the server to the database
connection.connect(function(err) {
    if(err) throw err;
    menuPrompt();

});

// brings up the initial menue that the user can navigate through
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

    // logic of actions that will be taken when the user selects a specific choice from the menu
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

// function that displays employee information
function viewEmployees() {
    var query = "SELECT * FROM employee";
        connection.query(query, function(err, res){
            console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
            
        });
        menuPrompt();
        });
};

// function that displays employee roles
function viewEmployeeRoles() {
    var query = "SELECT * FROM role";
        connecttion.query(query, function(err, res) {
            console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department: ${role.department_id}`);
        });
        menuPrompt();
        });
};