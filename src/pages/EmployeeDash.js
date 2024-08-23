// src/pages/EmployeeDash.js
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext'; // Ako je potrebno za podatke o korisniku
import { getEmployeeSessions, getAllEmployees, getStatistics } from '../services/Services'; // Dodaj ove funkcije u Services.js ako nisu već prisutne
import './pageStyles/employeeDash.css';

const EmployeeDash = () => {
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statistics, setStatistics] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsData = await getEmployeeSessions();
        const employeesData = await getAllEmployees();
        const statsData = await getStatistics();
        setSessions(sessionsData);
        setEmployees(employeesData);
        setStatistics(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

      <div className="dashboard-section">
        <h3>Employees</h3>
        <ul>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <li key={employee.id}>
                {employee.firstName} {employee.lastName} - Role: {employee.role}
              </li>
            ))
          ) : (
            <li>No employees found.</li>
          )}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Statistics</h3>
        <p>Total Sessions: {statistics.totalSessions || 0}</p>
        <p>Total Revenue: ${statistics.totalRevenue || 0}</p>
      </div>

      <div className="dashboard-section">
        <h3>Administration</h3>
        <button>Manage Sessions</button>
        <button>Manage Employees</button>
      </div>
    </div>
  );
};

export default EmployeeDash;
