const jwt = require('jsonwebtoken');
const secret = process.env.APP_SECRET || 'somestupidword';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {
      jwt.sign({
        id: user._id,
        roles: user.roles,
      }, secret, null, (error, token) => {
        if (error) return reject(error);
        resolve({token, id: user._id});
      });
    });
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, payload) => {
        if (error) return reject(error);
        resolve(payload);
      });
    });
  }

};
