const router = require('express').Router()
const {login} = require('../controller/user.controller')
router.post("/login",login)
module.exports = router