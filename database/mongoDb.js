const mongoose = require('mongoose');

const client = "mongodb://127.0.0.1:27017"
const db_connection = async ()=> {
      return await mongoose.connect(client)
}

module.exports ={db_connection,client}