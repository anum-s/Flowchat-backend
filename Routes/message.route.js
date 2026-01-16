const express = require('express');
const { sendMessage, getMessage } = require('../RouteControllers/messageroutercontroller');
const isLogin = require('../Middleware/isLogin');

const router = express.Router()

router.post('/send/:id',isLogin , sendMessage)
router.get('/:id',isLogin , getMessage)



module.exports = router;