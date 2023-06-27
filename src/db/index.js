const {db_connection, URI} = require('./mongoDb')
const { securePassword } = require('./password')
const { doesUserExist,doesUserInfoExist,doesItemExist,doesItemExist_2 } = require('./existErrors')

module.exports = {db_connection,URI,securePassword, 
    doesUserExist,doesUserInfoExist, doesItemExist, doesItemExist_2 }

