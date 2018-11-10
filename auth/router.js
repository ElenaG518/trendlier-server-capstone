'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());

const jwtAuth = passport.authenticate('jwt', { session: false });

module.exports = router;