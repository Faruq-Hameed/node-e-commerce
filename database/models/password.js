const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: { type: String, required: true },
    password: { type: String, required: true, trim: true, }
});

const Password = mongoose.model('password', schema);
module.exports = Password;

