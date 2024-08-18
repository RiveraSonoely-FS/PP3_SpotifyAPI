require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, JWT_SECRET, MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  spotifyId: String,
  refreshToken: String,
  accessToken: String,
  tokenExpiry: Date
});

const User = mongoose.model('User', userSchema);

const AUTHORIZATION_BASE_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SEARCH_URL = 'https://api.spotify.com/v1/search';

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('<a href="/login">Log in with Spotify</a>');
});

app.get('/login', (req, res) => {
  const authUrl = `${AUTHORIZATION_BASE_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-library-read`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(TOKEN_URL, new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const tokenExpiry = new Date(Date.now() + expires_in * 1000);

    let user = await User.findOne({ spotifyId: response.data.spotify_user_id });
    if (!user) {
      user = new User({
        spotifyId: response.data.spotify_user_id,
        refreshToken: refresh_token,
        accessToken: access_token,
        tokenExpiry
      });
      await user.save();
    } else {
      user.accessToken = access_token;
      user.tokenExpiry = tokenExpiry;
      await user.save();
    }

    const jwtToken = jwt.sign({ spotifyId: user.spotifyId }, JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/search?token=${jwtToken}`);
  } catch (error) {
    console.error(error);
    res.send('Error during authentication.');
  }
});

app.get('/search', authenticateJWT, async (req, res) => {
  const { query } = req.query;
  const { accessToken } = req.user;

  try {
    const response = await axios.get(SEARCH_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: 'track,album,artist,playlist', limit: 10 }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.send('Error during search.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
