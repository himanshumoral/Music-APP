require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch(error){
        console.log('Error connecting to MongoDB:');
    }
}

module.exports = connectDB;