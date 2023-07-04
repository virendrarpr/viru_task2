const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const cookie = require('cookie');
const app=express()
// if(process.env.NODE_ENV!=="production"){//as no node env so it will call
//     require("dotenv").config({path:'backend/config/config.env'})
// }
require("dotenv").config({path:'./config/config.env'})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({origin: true,credentials:true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
const user=require("./routers/user")
app.use("/api/v1",user)
app.get('/',(req,res)=>{

    // res.cookie('token','value',{
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 24 * 7,
    //     path:'/' 
    // })
    console.log(req.cookies);
    console.log(req);
    res.send('Authentication System')
})
module.exports =app;