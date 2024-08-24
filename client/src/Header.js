import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track');

  const handleSearch = () => {
    if (!query) return;
    onSearch(searchType, query);
    setQuery('');
  };

  return (
    <header className="bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="text-success">Music Search</h1>
        <div className="d-flex align-items-center">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="form-select me-2"
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
            className="form-control me-2"
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