INSERT INTO departments (dept_name)
VALUES
('Pharmacy'),
('Grocery'),
('Beauty'),
('Outdoor'),
('General'),
('Testing Department');

INSERT INTO roles (title,salary,dept_id)
VALUES
('Director', 60000, 5),
('General Manager',55000, 5),
('Assistant Manager',50000, 1),
('Grocery Manager',45000, 2),
('Fish Manager',45000, 3),
('Outdoor Manager',45000, 4),
('Cashier', 25000, 5),
('Testing Role', 1000, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Tommy','Williams',1,1),
('James','Miller',2,2),
('Jane','Doe',7,5),
('Dick', 'Jackson',7,10),
('Veronica', 'Johnson',4,5),
('Nelly', 'Charles',7,12),
('Timmy', 'Manfield',3,7),
('Kathy', 'Gilbert',7,12),
('Dana', 'Carrigon',7,11),
('Ed', 'Norton',4,10),
('Manny', 'White',5,1),
('Emily', 'Black',6,12),
('Riddly','Scott',7,10),
('Zach', 'Morris',7,5),
('Brad','Montigo',7,5),
('Ellen','Turner',7,1);