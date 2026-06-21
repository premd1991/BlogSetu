import mongoose from "mongoose";
import { seedDatabase } from "./utils/seeder.js";



 async function connectDB(){
    try{
    const response = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`);
    console.log("mongodb connected")
    await seedDatabase();
    }
    catch(err){
        console.log("Error:", err)
    }
}

export default connectDB;