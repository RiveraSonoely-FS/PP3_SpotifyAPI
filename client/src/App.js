import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const App = () => {
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('track');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (type, query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/search`, { params: { q: query, type } });
      let data;
      switch(type) {
        case 'track':
          data = response.data.tracks.items;
          break;
        case 'artist':
          data = response.data.artists.items;
          break;
        case 'album':
          data = response.data.albums.items;
          break;
        default:
          data = [];
      }
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((type, query) => {
    fetchResults(type, query);
  }, 300);

  const handleSubmit = () => {
    if (query.trim()) {
      handleSearch(searchType, query);
      setQuery('');
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
  };

  useEffect(() => {
    if (query) {
      handleSearch(searchType, query);
    }
  }, [query, searchType]);

  return (
    <div>
      <Header onSearch={(type, query) => {
        setSearchType(type);
        setQuery(query);
      }} />

      <div className="container mt-3">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-secondary" onClick={handleClearSearch}>
            Clear Search
          </button>
        </div>

        {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
        {error && <p className="text-danger">{error}</p>}
        {results.length === 0 && !loading && !error && <p>No results found</p>}
        <div className="row">
          {results.map((item, index) => (
            <div key={index} className="col-md-4 mb-3">
              {searchType === 'track' && item.album && item.album.images?.[0] && (
                <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <div className="card">
                    <img src={item.album.images[0].url} className="card-img-top" alt={item.name} />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">By {item.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                  </div>
                </a>
              )}
              {searchType === 'artist' && item.images?.[0] && (
                <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <div className="card">
                    <img src={item.images[0].url} className="card-img-top" alt={item.name} />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                    </div>
                  </div>
                </a>
              )}
              {searchType === 'album' && item.images?.[0] && (
                <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <div className="card">
                    <img src={item.images[0].url} className="card-img-top" alt={item.name} />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
