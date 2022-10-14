const { hashSync, genSaltSync } = require('bcrypt');

/**
 * Encrypt Secret Data
 * @param {Object} target
 * @returns {Object}
 */
module.exports = (target = null) => {
  const pass = {};

  Object.entries(target).forEach((elem) => {
    pass[elem[0]] = hashSync(elem[1], genSaltSync(10));
  });

  return pass;
};
