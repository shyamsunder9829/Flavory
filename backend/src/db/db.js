const mongoose = require('mongoose');



function connectDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error('MongoDB URI is not set. Please set MONGODB_URI or MONGO_URI in the environment.');
        return;
    }
    mongoose.connect(uri)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        })
}

module.exports = connectDB;
