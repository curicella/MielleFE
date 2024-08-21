import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './nav.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-item" id="navbar-logo">
        <NavLink to="/home">
          <img className="logo" src="./mielle_logo.jpeg" alt="logo" />
        </NavLink>
      </div>
      <div className="navbar-item" id='navbar-links'>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/booking">Booking</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
      </div>
      <div className="navbar-item" id='navbar-auth'>
        <NavLink to="/login">Login</NavLink>
        <Link to="/register" className="auth-button">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
