import React from 'react';
import { NavLink } from 'react-router';
import '../App.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header>
      <ul>
        <li className="logo-container">
          <img src="logo.png" alt="Bookstore" className="logo" />
        </li>
        <li><NavLink to="/main">Main</NavLink></li>
        <li><NavLink to="/about-us">About Us</NavLink></li>
        <li><NavLink to="/cart">Cart</NavLink></li>
        <li>
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? 'Go Dark' : 'Go Light'}
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Header;