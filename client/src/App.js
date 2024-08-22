import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
  
    try {
      const response = await axios.get('/search', {
        params: { q: query }
      });
      setTracks(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err.response ? err.response.data : err.message);
      setError('Error fetching data. Please try again.');
      setTracks([]);
    }
  };   

  return (
    <div className="container mt-5">
      <h1 className="text-center">Music Search</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search for music..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="list-group">
            {tracks.map(track => (
              <a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="list-group-item list-group-item-action d-flex align-items-center"
              >
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="img-thumbnail mr-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div>
                  <strong>{track.name}</strong><br />
                  {track.artists.map(artist => artist.name).join(', ')}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
