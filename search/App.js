import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      setAccessToken(token);
    } else {
      window.location.href = 'http://localhost:3000/login';
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3000/search', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { query }
      });
      if (response.data.tracks.items.length === 0) {
        setError('No results found.');
      }
      setResults(response.data.tracks.items);
    } catch (error) {
      setError('Error during search.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for music"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <div>
        {results.map((item) => (
          <div key={item.id}>
            <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={item.album.images[0]?.url} alt={item.name} width="100" />
              <p>{item.name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
