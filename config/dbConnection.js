import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO__URL)
    } catch (error) {
        console.log(error)
    }
}