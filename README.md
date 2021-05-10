# Employee Tracker

## Description

This application is meant to demonstrate the usages of navigating a server and changing a database through mySQL. There is no live link for this application. The purpose of this set of code is to create an amployee database that can navigate through departments, assign rolls as well as create, delete and change employee information. This is done by navigating through the console and following the menu prompts displayed to the user.

## User Story

```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```
## User Instructions:
- npm init -y
- npm install
- npm install inquirer
- npm install mysql
- node server.js

## Repository
[Project Repo](https://github.com/kjmckinley/employee-tracker.git)

## Project Demo

The following animation shows an example of the application being used from the command line:

![Command Line demo](./assets/12-sql-homework-demo-01.gif)


# DEVELOPER's NOTES


## Getting Started

You’ll need to use the [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to your MySQL database and perform queries, the [Inquirer package](https://www.npmjs.com/package/inquirer) to interact with the user via the command-line, and the [console.table package](https://www.npmjs.com/package/console.table) to print MySQL rows to the console.

**Important**: You will be committing a file that contains your database credentials. Make sure your MySQL password is not used for any other personal accounts, because it will be visible on GitHub. In upcoming lessons, you will learn how to better secure this password, or you can start researching npm packages now that could help you.

You might also want to make your queries asynchronous. MySQL2 exposes a `.promise()` function on Connections to "upgrade" an existing non-promise connection to use promises. Look into [MySQL2's documentation](https://www.npmjs.com/package/mysql2) in order to make your queries asynchronous.

Design the following database schema containing three tables:

![Database Demo](./assets/12-sql-homework-demo-02.png)

* **department:**

    * `id` - INT PRIMARY KEY

    * `name` - VARCHAR(30) to hold department name

* **role:**

    * `id` - INT PRIMARY KEY

    * `title` - VARCHAR(30) to hold role title

    * `salary` - DECIMAL to hold role salary

    * `department_id` - INT to hold reference to department role belongs to

* **employee:**

    * `id` - INT PRIMARY KEY

    * `first_name` - VARCHAR(30) to hold employee first name

    * `last_name` - VARCHAR(30) to hold employee last name

    * `role_id` - INT to hold reference to employee role

    * `manager_id` - INT to hold reference to another employee that is manager of the current employee. This field may be null if the employee has no manager

You may want to use a separate file containing functions for performing specific SQL queries you'll need to use. A constructor function or Class could be helpful for organizing these. You may also want to include a `seeds.sql` file to pre-populate your database. This will make the development of individual features much easier.

Because this application won’t be deployed, you’ll also need to provide a link to a walkthrough video that demonstrates its functionality and all of the acceptance criteria below being met. You’ll need to submit a link to the video and add it to the README of your project.


## Bonus

See if you can add some additional functionality to your application, such as the ability to:

* Update employee managers

* View employees by manager

* View employees by department

* Delete departments, roles, and employees

* View the total utilized budget of a department -- ie the combined salaries of all employees in that department


