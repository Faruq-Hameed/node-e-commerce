// const express = require('express')
const userRouter = require('./users')
const productRouter = require('./products')
const orderRouter = require('./order')
const payment = require('./payment')
const wallet = require('./wallet')
module.exports = {userRouter, productRouter, orderRouter, payment, wallet}
