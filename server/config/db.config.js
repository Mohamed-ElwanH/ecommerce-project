const mongoose = require('mongoose');
const URI = process.env.MONGO_URI;

const connectDB = async ()=>{
    try{
        await mongoose.connect(URI);
        console.log("DB connected");
    }
    catch(e){
        console.error("DB connection error:", e.message);
        process.exit(1);
    }
}

module.exports = connectDB;