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

function query(queryString, params = []) {
  let resolveFunc;
  let rejectFunc;
  const promise = new Promise((resolve, reject) => {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
  connection.query(queryString, params, function (error, results, fields) {
    if (error) rejectFunc(error);
    else resolveFunc(results);
  });
  return promise;
}


//Add Employee Function
async function addEmployee() {
  let manager = await getEmployees();
  let roles = await getRoles();

  inquirer.prompt([
    {
      type: 'input',
      message: `Employee's First Name?`,
      name: 'firstName',
    },
    {
      type: 'input',
      message: `Employee's Last Name?`,
      name: 'lastName',
    },
    {
      type: 'list',
      name: 'roleChoice',
      message: 'Choose Employee\'s role',
      choices: roles.map(item => {
        return {
          value: item.id,
          name: item.title
        }
      })
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Choose Manager',
      choices: [
        {
          name: 'None',
          value: null
        },
        ...manager.map(item => {
          return {
            value: item.id,
            name: item.first_name + ' ' + item.last_name
          }
        }),

      ]
    }
  ]).then(response => {
    connection.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE(?, ?, ?, ?)', [response.firstName, response.lastName, response.roleChoice, response.manager], (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('New Employee Added')
      startProgram();
    })
  })
}


//Create Department
async function createDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      message: `Department Name?`,
      name: 'newDepartment',
    }
  ]).then(response => {
    connection.query(`INSERT INTO department (name) VALUE (?);`, [response.newDepartment], (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('New Department created');
      startProgram();
    });
  })
}


//get all departments
async function getDepartments() {
  return await query('SELECT * FROM department;');
}

//get all roles
async function getRoles() {
  return await query('SELECT * FROM role;');
}

// get all employees
async function getEmployees() {
  return await query('SELECT * FROM employee;');
}

//get all managers
async function getManagers() {
  return await query('SELECT * FROM employee m WHERE (SELECT COUNT(*) FROM employee e WHERE e.manager_id = m.id) > 0;')
}

//create Role
async function newRole() {
  let departments = await getDepartments();
  inquirer.prompt([
    {
      type: 'input',
      message: 'Role Name?',
      name: 'newRole',
    },
    {
      type: 'input',
      message: 'Default Salary for new Role?',
      name: 'defSalary'
    },
    {
      type: 'list',
      name: 'choice',
      message: 'Please choose a department',
      choices: departments.map(item => {
        return {
          value: item.id,
          name: item.name
        }
      })
    }
  ]).then(response => {
    connection.query(`INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`, [response.newRole, response.defSalary, response.choice], (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('New Role Created')
      startProgram();
    })
  })
}

//update Roles
async function updateEmpRole() {
  let roles = await getRoles();
  let employees = await getEmployees();

  inquirer.prompt([
    {
      type: 'list',
      message: 'Choose an Employee',
      name: 'employee',
      choices: employees.map(item => {
        return {
          value: item.id,
          name: item.first_name + ' ' + item.last_name
        }
      })
    },
    {
      type: 'list',
      name: 'role',
      message: 'Choose Employee\'s new role',
      choices: roles.map(item => {
        return {
          value: item.id,
          name: item.title
        }
      })
    }
  ]).then(response => {
    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [response.role, response.employee], (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('Employee Role has been updated');
      startProgram();
    });
  })
}

//view employee by managers
async function viewEmpByManager() {
  let managers = await getManagers();

  inquirer.prompt([
    {
      type: 'list',
      name: 'managers',
      message: 'Choose a Manager',
      choices: managers.map(item => {
        return {
          value: item.id,
          name: item.first_name + ' ' + item.last_name
        }
      })
    }
  ]).then(response => {
    connection.query('SELECT * FROM employee WHERE manager_id = ?;', [response.managers], (error, results) => {
      if (error) {
        console.log(error)
      }
      console.table(results);
      startProgram();
    })
  })
}

//update employee manager
async function updateEmpManager() {
  let manager = await getManagers();
  let employees = await getEmployees();

  inquirer.prompt([
    {
      type: 'list',
      message: 'Choose an Employee',
      name: 'employee',
      choices: employees.map(item => {
        return {
          value: item.id,
          name: item.first_name + ' ' + item.last_name
        }
      })
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Choose Employee\'s new Manager',
      choices: manager.map(item => {
        return {
          value: item.id,
          name: item.first_name + ' ' + item.last_name
        }
      })
    }
  ]).then(response => {
    connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?;`, [response.manager, response.employee], (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('Employee Manager has been updated');
      startProgram();
    });
  })
}

//remove department
async function removeDepartment() {
  let departments = await getDepartments();
  inquirer.prompt([
    {
      type: 'list',
      name: 'departments',
      message: 'Choose a department',
      choices: departments.map(item => {
        return {
          value: item.id,
          name: item.first_name + ' ' + item.last_name
        }
      })
    }
  ]).then(response => {
    connection.query('DELETE FROM department WHERE id = ?;', [response.departments], (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log('This department has been delete');
      startProgram();
    })
  })

}

//remove role
async function removeRole() {
  let roles = await getRoles()
  inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: 'Choose a Role',
      choices: roles.map(items => {
        return {
          value: items.id,
          name: items.title
        }
      })
    }
  ]).then(response => {
    connection.query('DELETE FROM role WHERE id = ?;', [response.role], (error, results) => {
      if (error) {
        console.log(error)
      }
      console.log('The Roles has been deleted');
      startProgram();
    })
  })
}

//remove employee
async function removeEmployee() {
  let employee = await getEmployees()
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Choose a Employee',
      choices: employee.map(items => {
        return {
          value: items.id,
          name: items.first_name + ' ' + items.last_name
        }
      })
    }
  ]).then(response => {
    connection.query('DELETE FROM employee WHERE id = ?;', [response.employee], (error, results) => {
      if (error) {
        console.log(error)
      }
      console.log('The Employee has been deleted');
      startProgram();
    })
  })
}

async function viewBudget() {
  let departments = await getDepartments()

  inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: 'Choose a Department',
      choices: departments.map(item => {
        return {
          value: item.id,
          name: item.name
        }
      })
    }
  ]).then(response => {
    connection.query('SELECT department.id, department.name, SUM(role.salary) as budget FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ? GROUP BY department.id;', [response.department], (err, results)=> {
      if(err){
        console.log(err)
        connection.end();
      }
      console.table(results);
      startProgram()
    })
  })
}


// Start Program Function
async function startProgram() {
  const options = [
    'View Employees', //0
    'Add New Employee', //1
    'Delete Employee', //2
    'Update Employee Role', //3
    'Update Employee Manager',//4
    'Create a New Role', //5
    'View Roles', //6
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
    message: 'What would you like to do?',
    choices: options,
    name: 'choice'
  }]).then(async response => {
    if (response.choice === options[0]) {
      const employee = await getEmployees();
      console.table(employee);
      await startProgram();
    } else if (response.choice === options [1]) {
      await addEmployee();
    } else if (response.choice === options[2]) {
      await removeEmployee();
    } else if (response.choice === options[3]) {
      await updateEmpRole();
    } else if (response.choice === options[4]) {
      await updateEmpManager();
    } else if (response.choice === options[5]) {
      await newRole();
    } else if (response.choice === options[6]) {
      const roles = await getRoles();
      console.table(roles);
      await startProgram();
    } else if (response.choice === options[7]) {
      await removeRole();
    } else if (response.choice === options[8]) {
      await createDepartment();
    } else if (response.choice === options[9]) {
      const departments = await getDepartments();
      console.table(departments);
      await startProgram();
    } else if (response.choice === options[10]) {
      await removeDepartment();
    } else if (response.choice === options[11]) {
      await viewEmpByManager();
    } else if (response.choice === options[12]) {
      await viewBudget();
    } else if (response.choice === options[13]) {
      connection.end();
    }
  })
}


//Program connection to DB
connection.connect(async function (err) {
  if (err) throw  err;
  console.log("connected as id " + connection.threadId);
  await startProgram();
  // getDepatements();
});
