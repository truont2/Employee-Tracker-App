const { ansi16 } = require('color-convert');
const inquirer = require('inquirer');

const { strictEqual } = require('assert');
const express = require('express');
const mysql = require('mysql2');
const questions = require('./index');
const { NONAME } = require('dns');
const { Console } = require('console');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to mysql
const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root', 
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to the database")
);
const viewDepartments = () => {
    db.query('SELECT id, name FROM departments', (err, result) => {
        if(err) {
            throw err
        } console.log(result)
        start();
    })
}
const viewRoles = () => {
    db.query(`SELECT departments.id, roles.title, departments.name AS department, roles.salary FROM departments
    JOIN roles ON departments.id = roles.department_id;`, (err, result) => {
        if(err) {
            throw err
        } console.table(result)
        start();
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input', 
                message: 'What is the name of the department you wish to add?',
                name: 'newDepartment'
            }
        ]).then(answer => {
            const value = answer.newDepartment;
            db.query('INSERT INTO departments(name) VALUES (?)', value, (err, result) => {
                if(err){
                    throw err;
                }
                console.log('Department added!');
                start();
            })
        })
}

const addEmployee = () => {
     db.query('SELECT * FROM roles', (err,result) => {
         if(err){
             throw err;
         } console.table(result)
         const roleArr = result.map((role) => {
             return {name: role.title, value: role.id}
         })
         db.query('SELECT CONCAT(employees.first_name, " ", employees.last_name) AS name, role_id FROM employees', (err, result) => {
            if(err){
                throw err;
            } console.table(result)
            const employeesArr = result.map((employees) => {
                return {name: employees.name, value: employees.id}
            })
            const newArr = employeesArr.unshift({name: "None", value: null});
            inquirer
            .prompt([
                {
                    type: 'input', 
                    message: 'What is the first name of the new Employee?',
                    name: 'first_name'
                }, 
                {
                    type: 'input', 
                    message: 'What is the last name of the new Employee?',
                    name: 'last_name'
                },
                {
                    type: 'list', 
                    choices: roleArr, 
                    message: 'What is the new role of this Employee?',
                    name: 'roleID'
                }, 
                {
                    type: 'list',
                    message: "Who is the employees manager?", 
                    choices: employeesArr,
                    name: 'managerID'
                }
            ])
            .then(answer => {
                const params = [answer.first_name, answer.last_name, answer.roleID, answer.managerID]
                db.query("INSERT INTO employees(first_name, last_name, role_id, manager_id) VAlUES(?, ?, ?, ?)", params, (err, result) => {
                    if(err) {
                        throw err;
                    } console.table(result)
                    start();
                })
            })
         })
         
     })
}

const addRole = () => {
    db.query('SELECT * FROM departments', (err,result) => {
        if(err){
            throw err;
        }
        const departmentArr = result.map((department) => {
            console.log(department);
            return {name: department.name, value: department.id}
        })
        inquirer
           .prompt([
               {
                   type: 'input', 
                   message: 'What is the name of the role?',
                   name: 'newRole'
               }, 
               {
                   type: 'number', 
                   message: 'What is the salary of the role?',
                   name: 'salary'
               },
               {
                   type: 'list', 
                   choices: departmentArr, 
                   message: 'What department does this role belong to?',
                   name: 'departmentID'
               }
           ])
           .then((answer) => {
               console.log(answer);
               const roleAns= [answer.newRole, answer.salary, answer.departmentID]
               db.query("INSERT INTO roles (title, salary, department_id) VAlUES (?, ? , ?)", roleAns, (err, result) => {
                   if(err) {
                       throw err;
                   } console.table(result)
                   start();
               })
           })
    })
}
const viewEmployees = () => {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, title AS Job_Title, departments.name AS Department, salary AS Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager 
    FROM roles JOIN employees ON roles.id = employees.role_id 
    JOIN departments ON departments.id = roles.department_id 
    LEFT JOIN employees AS managers ON managers.id = employees.manager_id;`
    db.query(query, (err, result) => {
        if(err) {
            throw err;
        } console.table(result)
        start();
    })
}
const updateEmployee = () => {
    db.query('SELECT CONCAT(employees.first_name, " ", employees.last_name) AS name, role_id FROM employees', (err,result) => {
        if(err){
            throw err;
        }
        const employeeArr = result.map((employee) => {
            return {name: employee.name, value: employee.role_id}
        })
        db.query(`SELECT roles.id, roles.title FROM roles`, (err, result) => {
            
            if(err) {
                throw err
            } 
            const rolesArr = result.map(role => {
                return {name: role.title, value: role.id}
            })
            console.log(employeeArr)
            inquirer
            .prompt([
                {
                    type: 'list', 
                    message: "Which employee's role do you want to update?",
                    choices: employeeArr,
                    name: 'employee'
                }, 
                {
                    type: 'list', 
                    message: 'What role do you want to assign the selected employee',
                    choices: rolesArr,
                    name: 'newRole'
                }
            ])
            .then((answer) => {
                console.log(answer)
                const val = [answer.newRole, answer.employee]
                db.query("UPDATE employees SET role_id = ? WHERE role_id = ?", val, (err, result) => {
                    if(err) {
                        throw err;
                    } console.table(result)
                    console.log("updated role")
                    start();
                })
            })
        })
    })
}

const quit= () => {
    console.log("Have a good day!")
    db.end();
}
// put all function on this page first and then start doing classes and whatever
function start() {
    inquirer 
        .prompt([
            {
                type: 'list', 
                name: 'choice', 
                message: 'What would you like to do?', 
                choices: ['View All Employees','Add Employee', 'Update Employee','View All Roles','Add Role','View All Departments','Add Department', 'Quit']
            }
        ]).then(ans => {
            switch(ans.choice) {
                case "View All Employees":
                    viewEmployees()
                    break;
                
                case 'Add Employee':
                    addEmployee();
                    break;
                
                case 'Update Employee':
                    updateEmployee();
                    break;

                case 'View All Roles': 
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole(); 
                    break;

                case 'View All Departments': 
                    viewDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;
                
                default:
                    quit();
                    break;
            }
        })
        .catch(err => console.error(err))
}

app.use((req,res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

start();