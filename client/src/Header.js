import React from 'react';
import './Header.css'; // Add your custom CSS for header

const Header = () => {
  return (
    <header className="header bg-dark text-light">
      <div className="container">
        <h1 className="logo">MyMusicApp</h1>
      </div>
    </header>
  );
};

export default Header;
