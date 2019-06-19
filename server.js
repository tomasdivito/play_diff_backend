require('dotenv').config()
const express = require('express')

const PORT = process.env.PORT || 8080
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

const app = express()

app.get('/login', function (req, res) {
  const SPOTIFY_SCOPES = [
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private'
  ]
  const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
  const SCOPES = encodeURIComponent(SPOTIFY_SCOPES.join(' '))
  const REDIRECT_URI = encodeURIComponent('http://localhost:8080/auth')

  res.redirect(`${SPOTIFY_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`)
})

app.get('/logged_in', function (req, res) {
  console.log('req:', req)
  console.log('res:', res)

  res.send("Correctly logged in with spotify!!!")
})

app.get('/', (req, res) => res.send("Hello world"))

app.listen(PORT, () => console.log(`App running and listening on port ${PORT}`))
