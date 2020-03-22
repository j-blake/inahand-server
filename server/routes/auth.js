const express = require('express');
const loginService = require('../service/login');

const router = express.Router();

router.post('/auth/create', (req, res) => loginService.createLogin(req, res));

router.post('/auth/login', (req, res) => loginService.authenticateLogin(req, res));

router.post('/auth/logout', (req, res) => loginService.logout(req, res));

router.post('/auth/refresh', (req, res) => loginService.refreshSession(req, res));

module.exports = router;
