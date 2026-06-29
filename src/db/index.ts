import moongoose from "mongoose"

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not defined");
        }
        const connectionInstances = await moongoose.connect(process.env.MONGO_URL);
        if(connectionInstances){
            console.log("Connected to MongoDB");
        }
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB