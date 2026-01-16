const express = require ('express')
const isLogin = require ('../Middleware/isLogin')
const { getUserBySearch , getCurrentChatter} = require ('../RouteControllers/userroutercontroller')

const router = express.Router()

router.get('/search',isLogin, getUserBySearch)
router.get('/currentchatters',isLogin, getCurrentChatter)


module.exports = router;