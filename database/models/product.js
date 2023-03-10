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
    description: {
        type: String,
        required: true
      },
      maker: {
        type: String,
        required: true
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
        default: 0,
        trim: false
    }    
},
{ timestamps: true }
);

const Products = mongoose.model('Product', schema);
module.exports = Products;