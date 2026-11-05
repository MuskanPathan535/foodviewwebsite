// const mongoose = require('mongoose');

// function connectDB(){
//     mongoose.connect(process.env.MONGODB_URI)
//     .then(()=>{
//         console.log("MongoDB connected");
//     })
//     .catch((err)=>{
//         console.log("MongoDB connection error:",err);
//     })
// }
// module.exports = connectDB;


const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;