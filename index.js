const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "employee_tracker_db"
});








//Add Employee Function
function addEmployee(){
  inquirer.prompt([
    {
      type:'input',
      message:`Employee's First Name?`,
      name:'firstName',
    },
    {
      type:'input',
      message:`Employee's Last Name?`,
      name:'lastName',
    },
    {
      type:'list',
      message:`What will this Employee's Role be?`,
      choice:['Test','Test','Test'],
      name:'role',
    },
    {
      type:'input',
      message:`What is this Employee's department?`,
      choice: ['HR','IT','Legal','Executive','CS','Development','Security'],
      name:'department',
    },
  ]).then((response) => {
    connection.query('INSERT INTO employee(first_name, last_name,)')
  })
}












// Start Program Function
function startProgram() {
  const options = [
    'View Current Employees', //0
    'Add New Employee', //1
    'Delete Current Employee', //2
    'Update Employee Role', //3
    'Update Employee Manager',//4
    'Create a New Role', //5
    'View Current Roles', //6
    'Delete Role', //7
    'Create Department', //8
    'View Department', //9
    'Delete Department', //10
    'View Employee by Manager', //11
    'View budget by Departments', //12
    'Exit', //13
  ]
  inquirer.prompt([{
    type: 'list',
    message:'What would you like to do?',
    choices: options,
    name: 'choice'
  }]).then(response => {
    if(response.choice === options[0]){
      viewEmployees();
    } else if (response.choice === options [1]){
      addEmployee();
    } else if (response.choice === options[2]){
      removeEmployee();
    } else if (response.choice === options[3]){
      updateEmpRole();
    } else if (response.choice === options[4]){
      updateEmpManager();
    } else if (response.choice === options[5]){
      newRole();
    } else if (response.choice === options[6]){
      viewRoles();
    } else if (response.choice === options[7]){
      removeRole();
    } else if (response.choice === options[8]){
      createDepartment();
    } else if (response.choice === options[9]){
      viewDepartments();
    } else if (response.choice === options[10]){
      removeDepartment();
    } else if (response.choice === options[11]){
      viewEmpByManager();
    } else if (response.choice === options[12]){
      viewBudget();
    } else if (response.choice === options[13]){
      connection.end();
    }
  })
}
//Program connection to DB
connection.connect(function (err) {
  if (err) throw  err;
  console.log("connected as id " + connection.threadId);
  startProgram();
});
