require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const request = require('request')

const PORT = process.env.PORT || 8080
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const app = express()

app.get('/login', function (req, res) {
  const SPOTIFY_SCOPES = [
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private'
  ]
  const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize?'
  const REDIRECT_URI = 'http://localhost:8081/callback'

  res.redirect(SPOTIFY_AUTH_URL + querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SPOTIFY_SCOPES.join(' '),
    redirect_uri: REDIRECT_URI
  }))
})

app.get('/callback', function (req, res) {
  const code = req.query.code
  console.log('callback called')

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:8081/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    console.log(body);
    const ACCESS_TOKEN = body.access_token
    const REFRESH_TOKEN = body.refresh_token

    console.log('access-token:', ACCESS_TOKEN)

    res.redirect('http://localhost:3000/#' + querystring.stringify({
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN
    }))
  })
})

app.listen(PORT, () => console.log(`App running and listening on port ${PORT}`))