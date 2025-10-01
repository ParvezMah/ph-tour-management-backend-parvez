import cors from "cors";
import express, { Request, Response } from 'express';
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from './app/middleware/notFound';
import { router } from './app/routes';
import cookieParser from "cookie-parser";

const app = express();


app.use(cookieParser()) // to read cookies sent by the client in your request handlers
app.use(express.json());
app.use(cors());



app.use("/api/v1", router);




app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})


// Global Error Handler
app.use(globalErrorHandler);


// Route Not Found
app.use(notFound)


export default app;