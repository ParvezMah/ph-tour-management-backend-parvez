import cors from "cors";
import express, { Request, Response } from 'express';
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from './app/middleware/notFound';
import { router } from './app/routes';
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport" // to run the passport config file
import { envVars } from "./app/config/env";

const app = express();

// ================= Payment Webhook or Cron jobs =================

// ================= Cors at First ( When you add backend) =================
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}))

// ================= JSON + Cookies Parsing =================
app.use(cookieParser()) // to read cookies sent by the client in your request handlers
app.use(express.json());

// ================= Session =================
app.use(expressSession({ // Use express-session middleware before passport.session()
    secret: envVars.EXPRESS_SESSION_SECRET, // Used to sign the session ID cookie
    resave: false, // Don’t save session if unmodified
    saveUninitialized: false, // Don’t create session until something stored
})); 

// ================= Passport =================
app.use(passport.initialize()); // Initialize Passport middleware
app.use(passport.session()); // If using sessions, initialize session support

// ================= App Routes =================
app.use("/api/v1", router);

// ================= Health Routes =================
app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})

// ================= Global Error Handler =================
app.use(globalErrorHandler);

// ================= 404 Route =================
app.use(notFound)


export default app;