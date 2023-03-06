const mongoose = require('mongoose')

const schema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: false,
    },
    category: {
        type: String,
        required: true,
        trim: false,
    },
    availableQuantity: {
        type: Number,
        required: true,
        default: 1,
        trim: false,
    },
    productPrice: {
        type: Number,
        required: true,
        default: 0,
        trim: false,
    },
    soldQuantity: {
        type: Number,
        required: true,
        default: 0,
        trim: false
    }
});

const Products = mongoose.model('Product', schema);
module.exports = Products;