'use strict';
require('dotenv').config();
const { User } = require('./users/models');
const { Journey, Image } = require('./journeys/models');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const express = require('express');
const app = express();
const morgan = require('morgan');

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });


const { router: usersRouter } = require('./users');
const { router: journeysRouter } = require('./journeys');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/journeys/', journeysRouter);


const { PORT, DATABASE_URL } = require('./config');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


app.use(morgan(':remote-addr - :remote-user :date[web] :method :url :response-time '));
// app.use(morgan(':date :method :url :response-time'));

mongoose.Promise = global.Promise;






// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}



// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

module.exports = { app, runServer, closeServer };