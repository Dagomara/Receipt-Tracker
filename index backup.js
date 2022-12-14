require('dotenv').config(); // get .env stuffs
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
// register express session with MongoStore
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./db/connect');

// socket.io import
const io = require("./matchmaking/queue");
io.app = app;
io.run();

const corsOptions = {
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
    credentials: true,
    origin: process.env.URL_ROOT_CLIENT // do not write '*'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

database.then(() => console.log('Connected to MongoDB.')).catch(err => console.log(err));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'made with love :)',
    cookie: {
        maxAge: 60000 * 60 * 24, // 1 day
        secure:  (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? true : false,
        SameSite: "None"
    },
    saveUninitialized: true, // session management
    resave: false,
    name: 'discID',
    // Session Store for users to stay logged in
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(express.static(path.join(__dirname, 'public')));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use("/api", require("./routes/api"));
app.use("/auth", require("./routes/auth"));

// All other GET requests not handled before will return our React app
//if (process.env.NODE_ENV === 'production') {
app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
//}

app.listen(PORT, () => {
    console.log(`Now listening to requests on port ${PORT}`);
});
