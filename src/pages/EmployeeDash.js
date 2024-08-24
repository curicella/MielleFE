import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { getEmployeeSessions, getAllEmployees, getStatistics, addEmployee, deleteEmployee, manageSessions } from '../services/Services';
import './pageStyles/employeeDash.css';

const EmployeeDash = () => {
  const { user } = useContext(UserContext); // Assuming UserContext provides user details, including role
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsData = await getEmployeeSessions();
        setSessions(sessionsData);

        if (user?.role === 'admin') {
          const employeesData = await getAllEmployees();
          setEmployees(employeesData);
        }

        const statsData = await getStatistics();
        setStatistics(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleAddEmployee = async () => {
    try {
      const newEmployee = { firstName: "New", lastName: "Employee", role: "Photographer" }; // Example data
      await addEmployee(newEmployee);
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="employee-dashboard-container">
      <h2>Employee Dashboard</h2>

      <div className="dashboard-section">
        <h3>Upcoming Sessions</h3>
        <ul>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.id}>
                {session.type} - Date: {session.date} - Location: {session.location} - Status: {session.status}
              </li>
            ))
          ) : (
            <li>No upcoming sessions.</li>
          )}
        </ul>
      </div>

      {user?.role === 'admin' && (
        <>
          <div className="dashboard-section">
            <h3>Employees</h3>
            <ul>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <li key={employee.id}>
                    {employee.firstName} {employee.lastName} - Role: {employee.role}
                    <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
                  </li>
                ))
              ) : (
                <li>No employees found.</li>
              )}
            </ul>
          </div>

          <div className="dashboard-section">
            <h3>Administration</h3>
            <button onClick={handleAddEmployee}>Add Employee</button>
            <button onClick={manageSessions}>Manage Sessions</button>
            <button><a href='/upload-photo'>Upload Photos</a></button>
          </div>
        </>
      )}

      <div className="dashboard-section">
        <h3>Statistics</h3>
        <p>Total Sessions: {statistics.totalSessions || 0}</p>
        <p>Total Revenue: ${statistics.totalRevenue || 0}</p>
      </div>
    </div>
  );
};

export default EmployeeDash;
