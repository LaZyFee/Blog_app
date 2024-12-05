import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
