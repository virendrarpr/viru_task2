const res = require("express/lib/response");
const { sendEmail } = require("../middlewares/sendEmail");
const User =require('../models/User')
const jwt=require('jsonwebtoken')

exports.registerUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        let user=await User.findOne({email})
        if(user) return res.status(400).json({success:false,message:"User already exists"})
        user=await User.create({email,password})
        const token=await user.generateToken()
        await sendEmail(email,token)
        res.status(201).cookie("token",token,
        {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
        }
        ).
        json({success:true,user,token})
    }catch{(error)=>{
        res.status(500).json({
            sucess:false,
            message:error.message
        })
    }}
}
exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({success:false,message:"User does not exist"})
        }
        const isMatch=await user.matchPassword(password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"incorrect credentials"
            })
        }
        const token=await user.generateToken()
        res.cookie('token',token,{
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path:'/',
        })
        res.status=200;
        res.json({success:true,user,token})
        res.end()
        return
    }catch{
        (error)=>{
            res.status(500).json({success:false,message:error.message})
        }
    }
}

exports.logout=async (req,res)=>{
    try{
        return res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({success:true,message:'Logged Out'})
    }
    catch{(error)=>{
        return res.status(500).json({success:true,message:error.message})
    }}
}



exports.updatePassword=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("+password").exec()
        const {oldPassword,newPassword}=req.body
        if(!oldPassword || !newPassword){
            return res.status(400).json({success:false,message:'Please Provide both Old and New Password'})
        }
        const isMatch=await user.matchPassword(oldPassword)
        if(!isMatch){
            return res.status(400).json({
                success:true,
                message:'Incorrect Old Password'
            })
        }
        user.password=newPassword;
        await user.save()
        return res.status(200).json({success:true,message:'Password Updated'})
    }
    catch{(error)=>{
        return res.status(500).json({success:false,message:error.message})
    }}
}


exports.forgotPassword=async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({success:false,message:'User not found'})
        }
        const resetPasswordToken=user.getResetPasswordToken();
        await user.save()
        const resetUser=`${req.protocal}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`
        const message='Reset your password by clicking on the link below'
        try{
            await sendEmail({email:user.email,subject:'Reset Password',message})
            res.status(500).json({success:true,message:`Email sent to ${user.email}`})
        }catch (error){
                user.resetPasswordToken=undefined;
                user.resetPasswordExpire=undefined;
                await user.save()
                res.status(500).json({success:false,message:error.message})
            }
        
    }
    catch{(error)=>{
        return res.status(500).json({success:false,message:error.message})
    }}
}


exports.is_authenticated=async(req,res)=>{
    try{
        const {token}=req.cookies;
    if(!token){
        return res.status(200).json({success:false});
    }
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
    let user=await User.findById({_id:decoded._id});
    if(user) return res.status(200).json({success:true});
    else return res.status(200).json({success:false});
    }
    catch{(error)=>{
        res.status(500).json({success:false,message:error.message})
    }}
}


exports.varify_user=async(req,res)=>{
    try {
        const {token}=req.params
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        // const id=decoded.userId;
        // console.log(decoded);
        const user=await User.findByIdAndUpdate(decoded._id,{isVarified:true});
        res.status(200).send('Varified')

    }catch(err){
        res.status(500).json({success:false,message:'Something went wrong'})
    }
}