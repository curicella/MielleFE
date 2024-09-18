import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./pageStyles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Dodaj userType za izbor
  const [error, setError] = useState("");
  const { login, employeeLogin } = useContext(UserContext); // Dodaj employeeLogin
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (userType === "user") {
        const result = await login({ email, password }); // Pozovite login za korisnika
        if (result) { // Provera da li je login uspešan
          navigate("/gallery"); // Preusmerite korisnika na /gallery
        } else {
          setError("Invalid email or password"); // Postavite grešku ako prijava nije uspešna
        }
      } else {
        const result = await employeeLogin({ email, password }); // Pozovite login za zaposlenog
        if (result) { // Provera da li je prijava uspešna
          navigate("/employeeDash"); // Preusmerite zaposlenog na /employeeDash
        } else {
          setError("Invalid email or password"); // Postavite grešku ako prijava nije uspešna
        }
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };
  
  

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Welcome Back!</h2>
        <div className="authForm-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="authForm-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="authForm-group">
          <label htmlFor="userType">Login as:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="btn">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
