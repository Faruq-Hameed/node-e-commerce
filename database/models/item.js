const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
    {
    name: {
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
   price: {
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

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;