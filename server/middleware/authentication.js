const userService = require('../service/user');

function handleUnauthorizedResponse(res) {
  return res
    .status(401)
    .append(
      'WWW-Authenticate',
      'Bearer realm="Access to inahand data layer" charset="UTF-8"'
    )
    .send();
}

module.exports = async (req, res, next) => {
  const { session } = req;
  if (!session) {
    return handleUnauthorizedResponse(res);
  }
  let identity = null;
  try {
    identity = await userService.findById(session.identity);
  } catch (e) {
    // do nothing
  }
  if (!identity) {
    return handleUnauthorizedResponse(res);
  }
  req.identity = identity;
  return next();
};
