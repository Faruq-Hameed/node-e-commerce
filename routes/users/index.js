const { application } = require('express');
const express = require('express');
const userRouter = express.Router();
const { users, products, allUsersOrders } = require('../../database')



// userRouter.get('*', (req, res) => {
//     res.status(404).send('unknown request')
// })




userRouter.get('/', (req, res) => {

    const admin = users.find(user => user.userName === 'admin')
    if (req.body.userName === admin.userName && req.body.password === admin.password) {
        res.json({ subscribersInfo: users })
        return
    }
    res.status(401).send('unauthorized')
})

userRouter.get('/:userId', (req, res) => {
    const user = users.find(user => user.userId === req.params.userId)
    if (!user) return res.status(404).send('unknown user') 
         
    const userInfo = {}
    for (keys in user) {
        if (keys === "password" || keys === "walletBalance" ||keys === "email" ) continue //to hide the password & wallet balance
        userInfo[keys] = user[keys]
    }
    res.status(200).json({ userInfo})
})

userRouter.post('/', (req, res) => {
    const newUser = req.body
    if (newUser.name && newUser.email && newUser.password && newUser.userName) { //checking if all fields are provided
        newUser.userId = 'u' + (users.length + 1)
        newUser.walletBalance = req.body.credit || 0
        delete req.body.credit
        newUser.status = true
        newUser.dateSignedUp = new Date()
        users.push(newUser) //adding new user to the database
        const newUserCart = {//creating an  empty cart object for the new user
            userId: newUser.userId,
            userOrders: []
        }
        allUsersOrders.push(newUserCart) // adding the empty cart object to the database
        res.status(200).json({ userSummary: newUser })
    }
    else res.status(404).send("kindly input the required fields")
})

userRouter.patch('/:userId', (req, res) => {
    const user = users.find(user => user.userId === req.params.userId)
    if (!user) return res.status(404).send("unknown user")
    for (keys in req.body) {
        user[keys] = req.body[keys]
    }
    res.status(200).json({ "update successfully": user })

})

userRouter.delete('/:userId', (req, res) => {
    const user = users.find(user => user.userId === req.params.userId)
    const userIndex = users.findIndex(user => user.userId === req.params.userId)
    if (!user) return res.status(404).send("unknown user")

    else {
        const userCart = allUsersOrders.find(user => user.userId === req.params.userId)
        users.splice(userIndex, 1) // remove the user from the list
        userCart.userOrders.length = 0 //emptying the user cart for all orders but the user cart is still present
        res.status(200).send( "delete successfully, your cart is emptied we hope to see you again")
    }
})
module.exports = userRouter