const express = require('express');
const authController = require('./Controller/authController');

const routes = express.Router();

routes.post('/register', authController.store);
routes.post('/authenticate', authController.show);

module.exports = routes;