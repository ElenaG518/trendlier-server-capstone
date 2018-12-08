'use strict'
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://user:pass123@ds045475.mlab.com:45475/trendlier-server-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://user:pass123@ds045475.mlab.com:45475/trendlier-server-capstone';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.CLIENT_ORIGIN= 'https://trendlier-client-capstone.herokuapp.com/' || 'http://localhost:3000';
// exports.CLIENT_ORIGIN= process.env.CLIENT_ORIGIN || 'https://trendlier-client-capstone.herokuapp.com/'