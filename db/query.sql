use company_db;
-- combine role and employee

-- SELECT employees.id, employees.first_name, employees.last_name, title AS Job_Title, departments.name AS Department, salary AS Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager 
-- FROM roles JOIN employees ON roles.id = employees.role_id 
-- JOIN departments ON departments.id = roles.department_id 
-- LEFT JOIN employees AS managers ON managers.id = employees.manager_id;
-- so basically only add data where managers.id = employees.manager_id that will oply return emplyees first name and last name of a person in column managers that we make 

-- SELECT CONCAT(employees.first_name, " ", employees.last_name) AS name, role_id FROM employees;

INSERT INTO roles (title, salary, department_id) VAlUES ([ 'Sales rep', 60000, 3 ]);