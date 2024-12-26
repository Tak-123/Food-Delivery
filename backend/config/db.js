import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://stack:9902327891@cluster0.so1ih.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}