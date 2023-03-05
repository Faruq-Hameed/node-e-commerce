const mongoose = require('mongoose');

const URI = "mongodb://127.0.0.1:27017"
const db_connection = async ()=> {
      return await mongoose.connect(URI)
}

module.exports ={db_connection,URI}