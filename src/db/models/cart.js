const mongoose = require ('mongoose')
const cartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        itemId: {
            type: mongoose.ObjectId,
            ref: 'Item',
            required: true,
            
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number,
        // default: undefined
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true
})


const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart



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