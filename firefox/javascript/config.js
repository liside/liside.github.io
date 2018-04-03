experimentConfig = {
  "numOfQueries": 3,
  "queries": [
    {
      "description": "what is the average salary of all employees?",
      "answer": "SELECT AVG ( salary ) FROM Salaries",
      "complexity": "simple"
    },
    {
      "description": "what is the todate of the employees whose lastname is selenyi and salary is more than 43115?",
      "answer": "SELECT ToDate FROM Employees , Salaries WHERE LastName = 'Selenyi' AND salary > 43115",
      "complexity": "simple"
    },
    {
      "description": "what are the fromdates of the employees who are working in department with departmentnumber = d002. fetch only the first 4 records.",
      "answer": "SELECT FromDate FROM DepartmentEmployee WHERE DepartmentNumber = 'd002' LIMIT 4",
      "complexity": "simple"
    },
    {
      "description": "what is the firstname, lastname and hiredate of all the employees.",
      "answer": "SELECT FirstName , LastName , HireDate FROM Employees",
      "complexity": "simple"
    }

  ],
  "baseAPIEndpoint": "https://c220g1-031118.wisc.cloudlab.us/",
  "getQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/experiment_query",
  "checkQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/check_correctness",
  "saveLogQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/save_logs",
  "saveAudioQueryAPI": "https://c220g1-031118.wisc.cloudlab.us/save_audio",
}
