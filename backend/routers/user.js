const express=require('express')
const { registerUser, loginUser, logout, updatePassword, forgotPassword, is_authenticated, varify_user } = require('../controllers/user')
const { isAuthenticated } = require('../middlewares/auth')

const user=express.Router()
user.route("/register").post(registerUser)
user.route("/login").post(loginUser)
user.route('/logout').get(logout)
user.route('/update/password').put(isAuthenticated,updatePassword)
user.route('/forgotpassword').post(isAuthenticated,forgotPassword)
user.route('/is_authenticated').get(is_authenticated);
user.route('/varify/:token').get(varify_user)
module.exports=user