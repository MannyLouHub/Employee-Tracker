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





















// Start Program Function
function startProgram() {
  const options = [
    'View Current Employees',
    'Add New Employee',
    'Delete Current Employee',
    'Exit',
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
