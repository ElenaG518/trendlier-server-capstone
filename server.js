'use strict';
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const unirest = require('unirest');
const events = require('events');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: productsRouter } = require('./products');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/products/', productsRouter);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
});



app.use(bodyParser.json());
// app.use(cors());
app.use(express.static('public'));


app.use(morgan(':remote-addr - :remote-user :date[web] :method :url :response-time '));
// app.use(morgan(':date :method :url :response-time'));


// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
      data: 'rosebud'
    });
  });
  

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl , port = PORT) {

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

// external API call
let getFromBestBuy = function (product) {
    let emitter = new events.EventEmitter();
    let options = {
        host: 'api.bestbuy.com',
        path: '/beta/products/mostViewed(categoryId='+product+')?apiKey=69FfxSAlHfGvJuWIFqEYNdze',
        method: 'GET',
        headers: {
            'Authorization': "69FfxSAlHfGvJuWIFqEYNdze",
            'Content-Type': "application/json",
            'Port': 443,
            'User-Agent': 'Paw/3.1.2 (Macintosh; OS X/10.12.5) GCDHTTPRequest'
        }
    };

    https.get(options, function (res) {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
            let jsonFormattedResults = JSON.parse(body);
            emitter.emit('end', jsonFormattedResults);
        });
    })
    .on('error', function (e) {

        emitter.emit('error', e);
    });
    return emitter;
};


// local API endpoints
// to test endpoint use: http://localhost:8080/bestbuy/pcmcat209400050001

app.get('/bestbuy/:categoryId', function (req, res) {
    //external api function call and response
    // params received from client.js js-search-form and sent to getFromBestBuy,
    
    let searchReq = getFromBestBuy(req.params.categoryId);
    

    //get the data from the first api call
    // then the results are sent back to js-search-form in client.js
    searchReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});


// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

module.exports = { app, runServer, closeServer };