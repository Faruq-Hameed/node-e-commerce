const bcrypt = require('bcrypt');
const saltRounds = 10;


const securePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 	salt);
    return hashedPassword;
};


module.exports = { securePassword }

