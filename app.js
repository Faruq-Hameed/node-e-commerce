const express = require('express')
const morgan = require('morgan');
const helmet = require('helmet');

const {db_connection,URI} = require('./database')
const {users, items, cart, payment, wallet} = require('./routes')


require('dotenv').config({path: './.env'})

const port = process.env.PORT || 3000
const app = express();

db_connection()
    .then(result => {
        console.log('connected to database successfully')
    }).catch(err => {
        console.log('error connecting to database:', err.message)
        process.exit(1)
    })


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms - :remote-user :date"))
app.use(helmet())


app.use('/api/users', users)
app.use('/api/items', items)
app.use('/api/cart', cart)
app.use('/api/payments', payment)
app.use('/api/wallet', wallet)

app.use('/static',express.static('./public')) //added virtual prefix('/static'. It is needed to get public files directly)

app.get('/', (req, res)=>{

    // res.render('index')
    res.status(200).send("<h1>Hello world</h1>")
})

//handling all unknown url requests.
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that! Request failed")
  });

app.listen(port, ()=>{
    console.info('listening on port ', port)
})