const Identity = require('../model/identity');

exports.findOneById = async id => Identity.findById(id)
  .populate({
    path: 'profiles',
    populate: { path: 'accounts' },
  })
  .exec();

exports.findOneByEmailNoPopulate = async email => Identity.findOne({ email }).exec();
