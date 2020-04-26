const express = require('express');
const loginService = require('../../service/login');

const router = express.Router();

router.post('/auth/create', (req, res) => loginService.createIdentity(req, res));

router.post('/auth/login', (req, res) => loginService.authenticateLogin(req, res));

router.post('/auth/logout', (req, res) => loginService.logout(req, res));

router.get('/auth/check', (req, res) => loginService.checkAuthentication(req, res));

module.exports = router;
