const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email';
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const clientId = process.env.CLIENT_ID;

  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  
  res.redirect(authUrl);
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const type = req.query.type;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!type || !['track', 'artist', 'album'].includes(type)) {
    return res.status(400).json({ error: 'Invalid or missing type parameter' });
  }

  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q: query, type },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error?.message || 'Internal Server Error' });
  }
});

const generateAuthHeader = () => {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  return `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
};

const getAccessToken = async () => {
  try {
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({ grant_type: 'client_credentials' }), 
      { headers: { 
        'Authorization': generateAuthHeader(), 
        'Content-Type': 'application/x-www-form-urlencoded' 
      } 
    });
    return authResponse.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to get access token');
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
