const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({ grant_type: 'client_credentials' }), 
      { headers: { 
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`, 
          'Content-Type': 'application/x-www-form-urlencoded' 
        } 
      }
    );
    accessToken = authResponse.data.access_token;
    tokenExpiry = Date.now() + (authResponse.data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to fetch access token');
  }
}

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || 'track';

  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q: query, type },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
