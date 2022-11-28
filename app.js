const express = require('express')
const morgan = require('morgan');
// const routes = require('./routes')
const {userRouter, productRouter} = require('./routes')
// const productRouter = require('./routes/products')
// const productRouter = require('./routes')
require('dotenv').config({path: './.env'})

const port = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :remote-user :date"))


app.use('/users', userRouter)
app.use('/products', productRouter)
app.get('/', (req, res)=>{

    res.status(200).send("<h1>Hello world</h1>")
})

app.listen(port, ()=>{
    console.info('listening on port ', port)
})