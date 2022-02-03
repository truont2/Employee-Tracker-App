INSERT INTO departments(name)
VALUES("Engineering"),('HR'),('Sales');


INSERT INTO roles(title, salary, department_id)
VALUES("Senior Engineer", 120000, 1),('Software Engineer', 80000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Bob', 'Smith', 1, NULL);