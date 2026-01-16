const express = require('express');
const { userRegister,userLogin,userLogout } = require ('../RouteControllers/authuserroutercontroller.js')

const router = express.Router()

router.post('/register' , userRegister)
router.post('/login' , userLogin)
router.post('/logout' , userLogout)



module.exports = router;