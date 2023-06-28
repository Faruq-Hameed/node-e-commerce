const router = require('express').Router();
const getAllUsers = require('../src/controllers/userControllers')

router.get('/', getAllUsers)

module.exports = router;