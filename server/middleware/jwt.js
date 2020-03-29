const jwt = require('jsonwebtoken');
const _ = require('lodash');
const identityService = require('../service/identity');

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/create',
  '/api/auth/logout',
];

async function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_TOKEN, { algorithms: ['HS256'] });
}

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

function handleUnauthorizedResponse(res) {
  return res
    .status(401)
    .append('WWW-Authenticate', 'Bearer realm="Access to inahand data layer" charset="UTF-8"');
}

module.exports = async (req, res, next) => {
  if (PUBLIC_PATHS.find(path => path === req.path)) {
    return next();
  }
  const token = getToken(req);
  if (!token) {
    return handleUnauthorizedResponse(res).send();
  }
  try {
    const data = await verifyToken(token);
    if (!identity) {
      return handleUnauthorizedResponse(res).send();
    }
    req.identity = identity;
  } catch (e) {
    const cookie = req.signedCookies[process.env.COOKIE_NAME];
    if (_.isEmpty(cookie)) {
      return handleUnauthorizedResponse(res).send();
    }
    const identity = await identityService.findOneBySession(cookie);
    if (!identity) {
      return handleUnauthorizedResponse(res).send();
    }
    req.identity = identity;
  }
  return next();
};
