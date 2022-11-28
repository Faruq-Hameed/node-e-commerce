const { application } = require('express');
const express = require('express');
const userRouter = express.Router();
const { users, products } = require('../database')


// userRouter.get('*', (req, res) => {
//     res.status(404).send('unknown request')
// })


// userRouter.get('/', (req, res) => {
//     res.status(200).send('hello world from userRouter')
//   })

userRouter.get('/', (req, res) => {
    const userName = req.body.userName.toLowerCase()
    const password = req.body.password.toLowerCase()
    const admin = users.find(user => user.userName === 'admin')
    if (userName === admin.userName && password === admin.password) {
        res.json({ subscribersInfo: users })

    }
    else res.send('unknown user from user')
})


userRouter.post('/', (req, res) => {
    const newUser = req.body
    if (newUser.name) {
        if (newUser.email) {
            if (newUser.password) {
                newUser.userId = 'u' + (users.length + 1)
                newUser.walletBalance = req.body.credit || 0
                delete req.body.credit
                newUser.status = true
                newUser.dateSignedUp = new Date()
                users.push(newUser)
                res.status(200).json({ userSummary: newUser })
            }
            else res.status(404).send("kindly provide your password")
        }
        else res.status(404).send("kindly provide your email")
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


module.exports = userRouter