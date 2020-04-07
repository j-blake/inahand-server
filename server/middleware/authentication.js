const identityService = require('../service/identity');

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/create',
  '/api/auth/logout',
];

function handleUnauthorizedResponse(res) {
  return res
    .status(401)
    .append('WWW-Authenticate', 'Bearer realm="Access to inahand data layer" charset="UTF-8"');
}

module.exports = async (req, res, next) => {
  if (PUBLIC_PATHS.find(path => path === req.path)) {
    return next();
  }
  const { session } = req;
  if (!session) {
    return handleUnauthorizedResponse(res).send();
  }
  const identity = await identityService.findOneById(session.identity);
  if (!identity) {
    return handleUnauthorizedResponse(res).send();
  }
  req.identity = identity;
  return next();
};
