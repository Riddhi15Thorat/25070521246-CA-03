import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://riddhithorat09_db_user:YAcneHUFhDb8N2qt@cluster0.irht63w.mongodb.net/Expense");
    console.log("DB Connected");
};