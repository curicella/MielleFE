import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import './pageStyles/employeeDash.css';

const EmployeeDash = () => {
  const { employee, setEmployee, logout } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State za modal
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [notification, setNotification] = useState('');

  const roleMap = {
    0: 'Photographer',
    1: 'Videographer',
    2: 'Designer',
    3: 'Administrator',
  };

  // State za novog zaposlenog, sada uključuje JMBG
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    role: 'Photographer',
    email: '',
    password: '',
    jmbg: '', // Dodajemo JMBG
  });

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    type: 'photo',
    mediaFiles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (employee?.role === 'Administrator') {
          const employeesResponse = await fetch('http://naprednebaze.somee.com/api/Employees');
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData.$values);
        } else {
          const response = await fetch(`http://naprednebaze.somee.com/api/Employees/details/${employee.id}`);
          const data = await response.json();
    
          // Pristupamo rezervacijama zaposlenog
          const employeeBookings = data.employee.employeeBookings.$values.map((empBooking) => empBooking.booking);
          setSessions(employeeBookings); // Postavljamo stanje sa preuzetim rezervacijama
          console.log('Preuzeti podaci', employeeBookings);
        }
      } catch (error) {
        console.error('Greška prilikom preuzimanja podataka:', error);
      }
    };

    if (employee) {
      fetchData();
    }
  }, [employee]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const employeeToSend = {
      ...newEmployee,
      role: roleMap[newEmployee.role], // Mapiramo string na broj
    };
  
    try {
      const response = await fetch('http://naprednebaze.somee.com/api/Employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeToSend),
      });
  
      if (response.ok) {
        // Uspešan odgovor
        const employeesData = await (await fetch('http://naprednebaze.somee.com/api/Employees')).json();
        setEmployees(employeesData.$values);
        setNewEmployee({
          firstName: '',
          lastName: '',
          role: 'Photographer',
          email: '',
          password: '',
          jmbg: '',
        });
        setNotification('Employee successfully added.'); // Postavite obaveštenje
        setTimeout(() => setNotification(''), 5000); // Sakrijte obaveštenje nakon 5 sekundi
      } else {
        const errorMessage = await response.text();
        console.error('Greška prilikom dodavanja zaposlenog:', errorMessage);
        setNotification(`Error: ${errorMessage}`);
        setTimeout(() => setNotification(''), 5000); // Sakrijte obaveštenje nakon 5 sekundi
      }
    } catch (error) {
      console.error('Greška prilikom dodavanja zaposlenog:', error);
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(''), 5000); // Sakrijte obaveštenje nakon 5 sekundi
    }
  };
  

  const handleOpenModal = (employeeId) => {
    setSelectedEmployeeId(employeeId); // Postavljamo zaposlenog
    setIsModalOpen(true); // Otvaramo modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Zatvaramo modal
    setSelectedEmployeeId(null); // Resetujemo izabranog zaposlenog
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployeeId) return;
  
    try {
      const response = await fetch(`http://naprednebaze.somee.com/api/Employees/${selectedEmployeeId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Employee deleted successfully');
        
        // Ručno ažuriranje stanja zaposlenih bez ponovnog poziva API-ja
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== selectedEmployeeId));
        
      } else {
        console.error('Greška prilikom brisanja zaposlenog.');
      }
    } catch (error) {
      console.error('Greška prilikom brisanja zaposlenog:', error);
    } finally {
      handleCloseModal(); // Zatvaramo modal nakon brisanja
    }
  };
  

  const handleAddAlbum = async (sessionId) => {
    localStorage.setItem('selectedSessionId', sessionId);
    navigate('/upload-photo');
    // try {
    //   const response = await fetch(`https://localhost:7098/api/Sessions/${sessionId}/Albums`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(newAlbum),
    //   });

    //   if (response.ok) {
    //     setNewAlbum({
    //       title: '',
    //       type: 'photo',
    //       mediaFiles: [],
    //     });
    //     console.log('Album uspešno dodat.');
    //   } else {
    //     console.error('Greška prilikom dodavanja albuma.');
    //   }
    // } catch (error) {
    //   console.error('Greška prilikom dodavanja albuma:', error);
    // }
  };

  return (
    <div className="employee-dashboard-container">
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {notification && (
      <div className="notification">
        {notification}
      </div>
    )}

      {employee?.role !== 'Administrator' && (
        <div className="dashboard-section">
          <h3>Upcoming Sessions</h3>
          <ul>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <li key={session.id}>
                  {session.serviceType} - Date: {new Date(session.dateTime).toLocaleDateString()} - Location: {session.location} - Status: {session.status}
                  <button onClick={() => handleAddAlbum(session.id)}>Add Album</button>
                </li>
              ))
            ) : (
              <li>No upcoming sessions.</li>
            )}
          </ul>
        </div>
      )}

      {employee?.role === 'Administrator' && (
        <>
          <div className="dashboard-section">
            <h3>Employees</h3>
            <ul>
              {employees.length > 0 ? (
                employees
                  .filter(emp => roleMap[emp.role] !== 'Administrator')
                  .map((employee) => (
                    <li key={employee.id}>
                      {employee.firstName} {employee.lastName} - Role: {roleMap[employee.role]}
                      <button onClick={() => handleOpenModal(employee.id)}>Delete</button>
                    </li>
                  ))
              ) : (
                <li>No employees found.</li>
              )}
            </ul>
          </div>

          <div className="dashboard-section">
            <h3>Add New Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={newEmployee.firstName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={newEmployee.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Role:
                <select
                  name="role"
                  value={newEmployee.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Photographer">Photographer</option>
                  <option value="Videographer">Videographer</option>
                  <option value="Designer">Designer</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </label>
              <label>
                JMBG:
                <input
                  type="text"
                  name="jmbg"
                  value={newEmployee.jmbg}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Add Employee</button>
            </form>
          </div>
        </>
      )}

   {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this employee?</h3>
            <button onClick={handleConfirmDelete}>Yes, Delete</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDash;
