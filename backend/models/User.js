const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter a email"],
        unique:[true,"Email already exits"]
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        minlength:[6,'Password must have at least 6 characters'],
        required:[true,"Please enter a password"],
        select:false//when we accesss the data from the database of the user than it will select all excepts password
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateToken=async function(){
    return jwt.sign({_id:this._id},process.env.SECRET_KEY)
}
userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex")
    console.log(resetToken);
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire=Date.now()+10*60*1000
    return resetToken;
}
module.exports=mongoose.model("User",userSchema)