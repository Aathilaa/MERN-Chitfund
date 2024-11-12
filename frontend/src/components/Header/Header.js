
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../Assets/logo.jpg';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset logged in status
    // Add any additional logout logic (e.g., clearing tokens)
  };

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header id="navbar" className="header">
      <div className="logo">
        <img src={logo} alt="Chitfund Logo" />
      </div>
      <nav>
        <div className={`nav-links ${isNavOpen ? 'open' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/alert">Notifications</Link>
              <Link to="/admin">Admin</Link>
              <Link to="/payment-history">Payment History</Link>
              <Link to="/Signin" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <Link to="/Signin">Login</Link>
          )}
        </div>
        <div className="menu-icon" onClick={handleNavToggle}>
          <i className={`fas ${isNavOpen ? 'fa-times' : 'fa-bars'}`} />
        </div>
      </nav>
    </header>
  );
};

export default Header;



