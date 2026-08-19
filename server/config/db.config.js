const mongoose = require('mongoose');
const URI = process.env.MONGO_URI;

const connectDB = async ()=>{
    try{
        mongoose.connect(URI);
        console.log("DB connected");
    }
    catch(e){
        console.error("DB connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;