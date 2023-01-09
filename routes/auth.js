const router = require("express").Router();
const axios = require("axios");
const url = require('url');
const guildID = process.env.GUILD_ID;
const User = require('../db/UserSchema');
const cors = require('cors');
const clientRoot = process.env.URL_ROOT_CLIENT;
const serverRoot = process.env.URL_ROOT_SERVER;

const jwt = require('jsonwebtoken');
const authenticateToken = require('./authJwt').authenticateToken;
const md5 = require('md5');

var allowlist = [clientRoot, serverRoot];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
        origin: true, // reflect (enable) the requested origin in the CORS response
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        optionsSuccessStatus: 200,
        credentials: true
    } 
  } else {
    corsOptions = {
        origin: false // disable CORS for this request
    }
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

function genAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
}

let refreshTokens = []; // move this to mongoDB later!

// Refresh someone's JWT
router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = genAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  })
})

// Login for users.
// Input: username, password
// Result: Sends an error or sends you a JWT. 
router.post('/login', (req, res) => {
  // Authenticate user
  console.log(`${req.body.username} authenticated. Serializing...`);
  // serialize for JWT
  const username = req.body.username;
  const user = {username: username};

  const accessToken = genAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // will be invalid after logout
  refreshTokens.push(refreshToken);
  //node
  //require('crypto').randomBytes(64).toString('hex') gives the secrets :) 
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
})

// Register new users.
// Input: username, name, password (already encrypted).
// Result: Sends an error or makes your account, logging in automatically + sending you to dash.
router.put('/register', async (req, res) => {
  console.log("Registering", req.body.username);
  // check if user already exists
  if (await User.exists({username: req.body.username}))
    return res.status(409).json({
      "status": "failed",
      "error": "Your username is already in use."
  });

  // otherwise, make them and give them an auth key!
  let user = new User({
    username: req.body.username,
    name: req.body.name,
    companies: [],
    password: md5(req.body.password)
  });

  await user
    .save()
    .then(async (user_doc) => {
      console.log(`Added new user ${req.body.username}! Redirecting them...`);
      // redirect to the welcome screen!
      res.redirect(clientRoot+"/welcome");
    })
    .catch(err => {
      return res.status(400).json({
        "status": "failed",
        "error": err
      });
    });
  })

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204); // success
})

module.exports = router;