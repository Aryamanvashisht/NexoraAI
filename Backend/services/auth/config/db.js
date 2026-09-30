import mongoose from "mongoose";

async function databaseConnection() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        if (connection) {
            console.log(`Connection succesfull`);
        }
    } catch (error) {
        console.log(`Error establishing connection with Database`,error);
    }
}

export default databaseConnection;