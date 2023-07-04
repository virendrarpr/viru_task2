const mongoose=require('mongoose')
exports.connectDataBase=()=>{
    mongoose.connect(process.env.MONGO_URL).then((con)=>{console.log(`Database Connected: ${con.connection.host}`);})//con.connection.host tell us where it is hosted
    .catch((err)=>{
        console.log(`Connection failed. Err:${err}`);
    })
}