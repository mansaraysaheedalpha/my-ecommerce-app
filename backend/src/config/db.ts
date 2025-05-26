//src/config/db.ts
import mongoose from "mongoose"

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI
  if(!mongoURI) {
    console.error(`FATAL ERROR: MONGO_URI is not defined in .env`)
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(mongoURI)
    console.log(`Connected Successfully to MONGODB: ${conn.connection.host}`)
  } catch (error: any) {
    console.error("Could not connect to MONGODB", error.message || error)
    process.exit(1)
  }
}

export default connectDB;