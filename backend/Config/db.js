import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || "mongodb://mongo:27017/ehr";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB");
        return mongoose;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;