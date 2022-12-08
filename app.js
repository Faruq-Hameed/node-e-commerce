const express = require('express')
const morgan = require('morgan');
const {userRouter, productRouter, orderRouter, payment, wallet} = require('./routes')

require('dotenv').config({path: './.env'})

const port = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :remote-user :date"))


app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/orders', orderRouter)
app.use('/payments', payment)
app.use('/wallet', wallet)

app.get('/', (req, res)=>{

    res.status(200).send("<h1>Hello world</h1>")
})

//handling all unknown url requests.
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that! Request failed")
  });

app.listen(port, ()=>{
    console.info('listening on port ', port)
})