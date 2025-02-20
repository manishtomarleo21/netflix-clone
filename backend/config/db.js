import mongoose from "mongoose";
import { ENV_VARIABLES } from './envVariables.js'

export const connectDB = async()=>{

    try {
        const conn = await mongoose.connect(ENV_VARIABLES.MONGODB_URI)
        console.log("MongoDB connected");
        
    } catch (error) {
        console.log("Error in connecting to MongoDB:" + error.message);
        process.exit(1);
        
    }

}