import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo connected!")
    } catch {
        console.error("not connected!")
        process.exit(1)
    }
}

export default connectDB
