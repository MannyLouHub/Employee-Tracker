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
  database: "top_songsdb"
});