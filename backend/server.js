const app=require('./app');
const { connectDataBase } = require('./config/database');
connectDataBase()
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port number ${process.env.PORT}`);
})