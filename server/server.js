const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q: query, type: 'track' },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json(response.data.tracks.items);
  } catch (error) {
    console.error('Error searching tracks:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  const authResponse = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }), 
    { headers: { 'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return authResponse.data.access_token;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
