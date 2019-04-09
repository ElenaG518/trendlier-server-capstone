'use strict'

exports.DATABASE_URL = process.env.DATABASE_URL; 
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY;
exports.CLIENT_ORIGIN= process.env.CLIENT_ORIGIN || 'http://localhost:3000';
