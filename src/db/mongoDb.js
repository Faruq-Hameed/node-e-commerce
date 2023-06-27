const mongoose = require('mongoose');
require('dotenv').config({path: './.env'})

const URI = process.env.MONGODB_URL
const db_connection = async ()=> {
      return await mongoose.connect(URI)
}

module.exports ={db_connection,URI}
