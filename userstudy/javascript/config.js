experimentConfig = {
  "numOfQueries": 34,
  "queries": [
    {
      "description": "Training 1: What is the average salary of all employees?",
      "answer": "SELECT AVG ( salary ) FROM Salaries",
      "complexity": "simple",
      "mode": "speak",
      "id": "training-1"
    },
    {
      "description": "Training 2: Fetch the highest salary, least salary and number of salaries for each ending date of the employees whose joining date is December 15th 1995",
      "answer": "SELECT ToDate , MAX ( salary ) , COUNT ( salary ) , MIN ( salary ) FROM Salaries WHERE FromDate = '1995-12-15' GROUP BY ToDate",
      "complexity": "complex",
      "mode": "type",
      "id": "training-2"
    },
    {
      "description": "1. Get the ending dates of the employees with lastname selenyi and salary more than 43000",
      "answer": "SELECT ToDate FROM Employees , Salaries WHERE LastName = 'Selenyi' AND salary > 43000",
      "complexity": "simple",
      "mode": "speak",
      "id": 1
    },
    {
      "description": "2. Fetch the joining date , ending date and salary of the employees with first name either Tomokazu or Goh or Narain or Perla or Shimshon",
      "answer": "SELECT FromDate , salary , ToDate FROM Employees , Salaries WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND FirstName IN ( 'Tomokazu' , 'Goh' , 'Narain' , 'Perla' , 'Shimshon' )",
      "complexity": "complex",
      "mode": "type",
      "id": 2
    },
    {
      "description": "3. Get the starting dates of the employees who are working in department number d002. fetch only the first 4 records.",
      "answer": "SELECT FromDate FROM DepartmentEmployee WHERE DepartmentNumber = 'd002' LIMIT 4",
      "complexity": "simple",
      "mode": "speak",
      "id": 3
    },
    {
      "description": "4. Fetch all records of the department managers belonging to either department number d002, d003 or d008",
      "answer": "SELECT * FROM DepartmentManager WHERE DepartmentManager . DepartmentNumber = 'd002' OR DepartmentManager . DepartmentNumber = 'd008' OR DepartmentManager . DepartmentNumber = 'd003'",
      "complexity": "complex",
      "mode": "type",
      "id": 4
    },
    {
      "description": "5. Get the ending dates of the employees with lastname selenyi and salary more than 43000",
      "answer": "SELECT ToDate FROM Employees , Salaries WHERE LastName = 'Selenyi' AND salary > 43000",
      "complexity": "simple",
      "mode": "type",
      "id": 1
    },
    {
      "description": "6. Fetch the joining date , ending date and salary of the employees with first name either Tomokazu or Goh or Narain or Perla or Shimshon",
      "answer": "SELECT FromDate , salary , ToDate FROM Employees , Salaries WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND FirstName IN ( 'Tomokazu' , 'Goh' , 'Narain' , 'Perla' , 'Shimshon' )",
      "complexity": "complex",
      "mode": "speak",
      "id": 2
    },
    {
      "description": "7. Get the starting dates of the employees who are working in department number d002. fetch only the first 4 records.",
      "answer": "SELECT FromDate FROM DepartmentEmployee WHERE DepartmentNumber = 'd002' LIMIT 4",
      "complexity": "simple",
      "mode": "type",
      "id": 3
    },
    {
      "description": "8.Fetch all records of the department managers belonging to either department number d002, d003 or d008",
      "answer": "SELECT * FROM DepartmentManager WHERE DepartmentManager . DepartmentNumber = 'd002' OR DepartmentManager . DepartmentNumber = 'd008' OR DepartmentManager . DepartmentNumber = 'd003'",
      "complexity": "complex",
      "mode": "speak",
      "id": 4
    },
    {
      "description": "9. Get the first name , last name and hiring dates of all the employees",
      "answer": "SELECT FirstName , LastName , HireDate FROM Employees",
      "complexity": "simple",
      "mode": "type",
      "id": 5
    },
    {
      "description": "10. What is the average salary for each first name of the department managers?",
      "answer": "SELECT FirstName , AVG ( salary ) FROM Employees , Salaries , DepartmentManager WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND Employees . EmployeeNumber = DepartmentManager . EmployeeNumber GROUP BY Employees . FirstName",
      "complexity": "complex",
      "mode": "speak",
      "id": 6
    },
    {
      "description": "11. Get the starting dates of the department managers with the first name zito, sorted by hiring date.",
      "answer": "SELECT FromDate FROM Employees , DepartmentManager WHERE FirstName = 'Zito' ORDER BY HireDate",
      "complexity": "simple",
      "mode": "type",
      "id": 7
    },
    {
      "description": "12. Fetch all fields of the employees whose ending date is October 10th 2001 or whose hiring date is October 5th 1996 or whose title is Technique Leader. get only the first 10 records.",
      "answer": "SELECT * FROM Employees , Titles WHERE ToDate = '2001-10-09' OR Employees . HireDate = '1996-05-10' OR title = 'Technique Leader' LIMIT 10",
      "complexity": "complex",
      "mode": "speak",
      "id": 8
    },
    {
      "description": "13. Get the first name , last name and hiring dates of all the employees",
      "answer": "SELECT FirstName , LastName , HireDate FROM Employees",
      "complexity": "simple",
      "mode": "speak",
      "id": 5
    },
    {
      "description": "14. What is the average salary for each first name of the department managers?",
      "answer": "SELECT FirstName , AVG ( salary ) FROM Employees , Salaries , DepartmentManager WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND Employees . EmployeeNumber = DepartmentManager . EmployeeNumber GROUP BY Employees . FirstName",
      "complexity": "complex",
      "mode": "type",
      "id": 6
    },
    {
      "description": "15. Get the starting dates of the department managers with the first name zito, sorted by hiring date.",
      "answer": "SELECT FromDate FROM Employees , DepartmentManager WHERE FirstName = 'Zito' ORDER BY HireDate",
      "complexity": "simple",
      "mode": "speak",
      "id": 7
    },
    {
      "description": "16. Fetch all fields of the employees whose ending date is October 10th 2001 or whose hiring date is October 5th 1996 or whose title is Technique Leader. get only the first 10 records.",
      "answer": "SELECT * FROM Employees , Titles WHERE ToDate = '2001-10-09' OR Employees . HireDate = '1996-05-10' OR title = 'Technique Leader' LIMIT 10",
      "complexity": "complex",
      "mode": "type",
      "id": 8
    },
    {
      "description": "17. What is the total salary of all the employees who joined on August 6th 1999 or October 6th 1985?",
      "answer": "SELECT FirstName , LastName , HireDate FROM Employees",
      "complexity": "simple",
      "mode": "speak",
      "id": 9
    },
    {
      "description": "18. What is the average salary , highest salary for each gender type of the employees?",
      "answer": "SELECT Gender , AVG ( salary ) , MAX ( salary ) FROM Employees , Salaries WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber GROUP BY Employees . Gender",
      "complexity": "complex",
      "mode": "type",
      "id": 10
    },
    {
      "description": "19. What is the number of salaries for each ending date of the employees whose joining date is August 7th 1993?",
      "answer": "SELECT ToDate , COUNT ( salary ) FROM Salaries WHERE FromDate = '1993-08-07' GROUP BY ToDate",
      "complexity": "simple",
      "mode": "speak",
      "id": 11
    },
    {
      "description": "20. Fetch the gender , birth date and salary of the department managers, sorted by the first name.",
      "answer": "SELECT Gender , BirthDate , salary FROM Employees , Salaries , DepartmentManager WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND Employees . EmployeeNumber = DepartmentManager . EmployeeNumber ORDER BY Employees . FirstName",
      "complexity": "complex",
      "mode": "type",
      "id": 12
    },
    {
      "description": "21. What is the total salary of all the employees who joined on August 6th 1999 or October 6th 1985?",
      "answer": "SELECT FirstName , LastName , HireDate FROM Employees",
      "complexity": "simple",
      "mode": "type",
      "id": 9
    },
    {
      "description": "22. What is the average salary , highest salary for each gender type of the employees?",
      "answer": "SELECT Gender , AVG ( salary ) , MAX ( salary ) FROM Employees , Salaries WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber GROUP BY Employees . Gender",
      "complexity": "complex",
      "mode": "speak",
      "id": 10
    },
    {
      "description": "23. What is the number of salaries for each ending date of the employees whose joining date is August 7th 1993?",
      "answer": "SELECT ToDate , COUNT ( salary ) FROM Salaries WHERE FromDate = '1993-08-07' GROUP BY ToDate",
      "complexity": "simple",
      "mode": "type",
      "id": 11
    },
    {
      "description": "24. Fetch the gender , birth date and salary of the department managers, sorted by the first name.",
      "answer": "SELECT Gender , BirthDate , salary FROM Employees , Salaries , DepartmentManager WHERE Employees . EmployeeNumber = Salaries . EmployeeNumber AND Employees . EmployeeNumber = DepartmentManager . EmployeeNumber ORDER BY Employees . FirstName",
      "complexity": "complex",
      "mode": "speak",
      "id": 12
    },
    {
      "description": "25. Fetch all records of the department managers belonging to department number d008",
      "answer": "SELECT * FROM DepartmentManager WHERE DepartmentNumber = 'd008'",
      "complexity": "simple",
      "mode": "type",
      "id": 13
    },
    {
      "description": "26. Fetch the joining date and department number of the employees who work in the marketing department and whose ending date is June 2nd 1993.",
      "answer": "SELECT FromDate , DepartmentNumber FROM Departments , DepartmentEmployee WHERE DepartmentName = 'Marketing' AND DepartmentEmployee . DepartmentNumber = Departments . DepartmentNumber AND ToDate = '1993-06-02'",
      "complexity": "complex",
      "mode": "speak",
      "id": 14
    },
    {
      "description": "27. Fetch the starting dates and ending dates of the employees whose salary is not between 50000 and 80000",
      "answer": "SELECT FromDate , ToDate FROM Salaries WHERE salary NOT BETWEEN 50000 AND 80000",
      "complexity": "simple",
      "mode": "type",
      "id": 15
    },
    {
      "description": "28. Fetch the joining date and ending date of the department managers working in either research Department or in the department number d007 or d009.",
      "answer": "SELECT FromDate , ToDate FROM Departments , DepartmentManager WHERE DepartmentNumber = 'd007' OR Departments . DepartmentNumber = 'd009' OR DepartmentManager . DepartmentNumber = Departments . DepartmentNumber OR DepartmentName = 'Research'",
      "complexity": "complex",
      "mode": "speak",
      "id": 16
    },
    {
      "description": "29. Fetch all records of the department managers belonging to department number d008",
      "answer": "SELECT * FROM DepartmentManager WHERE DepartmentNumber = 'd008'",
      "complexity": "simple",
      "mode": "speak",
      "id": 13
    },
    {
      "description": "30. Fetch the joining date and department number of the employees who work in the marketing department and whose ending date is June 2nd 1993.",
      "answer": "SELECT FromDate , DepartmentNumber FROM Departments , DepartmentEmployee WHERE DepartmentName = 'Marketing' AND DepartmentEmployee . DepartmentNumber = Departments . DepartmentNumber AND ToDate = '1993-06-02'",
      "complexity": "complex",
      "mode": "type",
      "id": 14
    },
    {
      "description": "31. Fetch the starting dates and ending dates of the employees whose salary is not between 50000 and 80000",
      "answer": "SELECT FromDate , ToDate FROM Salaries WHERE salary NOT BETWEEN 50000 AND 80000",
      "complexity": "simple",
      "mode": "speak",
      "id": 15
    },
    {
      "description": "32. Fetch the joining date and ending date of the department managers working in either research Department or in the department number d007 or d009.",
      "answer": "SELECT FromDate , ToDate FROM Departments , DepartmentManager WHERE DepartmentNumber = 'd007' OR Departments . DepartmentNumber = 'd009' OR DepartmentManager . DepartmentNumber = Departments . DepartmentNumber OR DepartmentName = 'Research'",
      "complexity": "complex",
      "mode": "type",
      "id": 16
    },
  ],
  "baseAPIEndpoint": "https://c220g1-031118.wisc.cloudlab.us/",
  "getQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/experiment_query",
  "checkQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/check_correctness",
  "saveLogQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/save_logs",
  "saveAudioQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/save_audio"
}
