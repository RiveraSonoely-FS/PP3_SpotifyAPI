import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import musicLogo from './spotify.png';

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track');

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(searchType, query);
    setQuery('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={musicLogo} alt="Music Logo" style={{ width: '40px', height: 'auto' }} />
          <h1 className="text-success" style={{margin: '10px', fontFamily: 'gotham'}}>Music Search</h1>
        </div>
        <div className="d-flex align-items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="form-select me-2"
            aria-label="Search type"
          >
            <option value="track">Tracks</option>
            <option value="artist">Artists</option>
            <option value="album">Albums</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-control me-2"
            aria-label="Search query"
          />
          <button onClick={handleSearch} className="btn btn-success">
            Search
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
