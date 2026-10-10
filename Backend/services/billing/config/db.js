import { connect } from "mongoose"

const databaseConnection = async () => {
    
    try {
        const connection = await connect(process.env.MONGODB_URI);
        if (connection) {
         console.log(`Connection succesfull`);
     }   
    } catch (error) {
        console.log(`Error establishing connection with Database`, error);
    }
}

export default databaseConnection