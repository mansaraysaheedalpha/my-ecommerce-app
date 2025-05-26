//src/index.ts
import dotenv from "dotenv";
dotenv.config()

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes"
import { errorMiddleware, notFound } from "./middleware/errorMiddleware";

connectDB()
const app: Application = express()
const PORT = process.env.PORT || "3000"

// ---Request configuration middlewares
app.use(cors())
app.use(helmet())
app.use(express.json())

// ----Requests Routes----
app.use('/api/products', productRoutes)
// ----End Requests Routes-----

//------Error Middleware----
import { NextFunction } from "express";

app.use(notFound as (req: Request, res: Response, next: NextFunction) => void);
app.use(errorMiddleware as (err: Error, req: Request, res: Response, next: NextFunction) => void);

//----End Error Middleware-----


app.listen(PORT, () => {
  console.log(`🚀Server running at http://localhost:${PORT}`)
})

