const mongoose = require ('mongoose')
const cartSchema = new mongoose.Schema({
    owner: {
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    items: [{
        itemId: {
            type: ObjectID,
            ref: 'Item',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})


const User_cart = mongoose.model('Wallet', cartSchema);
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