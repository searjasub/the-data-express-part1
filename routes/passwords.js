const bcrypt = require('bcrypt-nodejs');

exports.saltAndHash = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(2000), null);
};
exports.verify = (pass, hash) => {
    return bcrypt.compareSync(pass, hash);
};