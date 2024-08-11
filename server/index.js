const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

const CLIENT_ID = 'abee4bd5fb274b5fabd34a281cc331ca';
const CLIENT_SECRET = 'ac27aa119822471ca671e42e20eae3a0';

app.use(express.json());

const getAccessToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    }
  );
  return response.data.access_token;
};

app.get('/search', async (req, res) => {
  const query = req.query.query;
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: query,
          type: 'track',
          limit: 10,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data.tracks.items);
  } catch (error) {
    res.status(500).send('Error occurred while searching for tracks');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
