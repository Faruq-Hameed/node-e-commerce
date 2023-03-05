const mongoose = require ('mongoose')
const walletSchema = new mongoose.Schema({
    user_id: {
        type : String,
        required : true,
    },
    balance: {
        type : Number,
        required : true,
        default : 0
    }
})
const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet