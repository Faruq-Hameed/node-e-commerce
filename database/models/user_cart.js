const mongoose = require ('mongoose')
const user_cart_schema = new mongoose.Schema({
    user_id: {
        type : String,
        required : true,
    },
    userOrders: {
        type: Array,
    }
   
})
const User_cart = mongoose.model('Wallet', user_cart_schema);
module.exports = User_cart

// const allUsersOrders = [
//     {
//         userId: 'u1',
//         userOrders: [{
//             orderId: 'u1Or1',
//             productId: 'p1',
//             orderQty: 5,
//             orderValue: 50
//         },
//         {
//             orderId: 'u1Or2',
//             productId: 'p1',
//             orderQty: 10,
//             orderValue: 100
//         },]
//     },

//     {
//         userId: 'u2',
//         userOrders: [{
//             orderId: 'u2Or1',
//             productId: 'p1',
//             orderQty: 6,
//             orderValue: 60
//         },
//         {
//             orderId: 'u2Or2',
//             productId: 'p2',
//             orderQty: 3,
//             orderValue: 60
//         }
//     ]
//     },