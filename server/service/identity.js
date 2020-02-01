const Identity = require('../model/identity');

exports.findOneBySession = async (session) => {
  const identity = await Identity.findOne({ 'sessions.uuid': session }).exec();
  return identity;
};
