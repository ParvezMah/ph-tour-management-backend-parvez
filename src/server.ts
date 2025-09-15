/* eslint-disable no-console */
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";


let server: Server;




const startServer = async()=>{
    try {
        console.log(envVars.NODE_ENV);
        await mongoose.connect(envVars.DB_URL);
        console.log('Connected to DB!!')

        server = app.listen(envVars.PORT, ()=>{
            console.log(`Server is Listening at Port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()




/*
1. UnHandled Rejection Error
2. UnCaught Rejection Error
3. Signal Termination (SigTerm)
*/


// // 1. UnHandled Rejection Error
// process.on("unhandledRejection", (err)=>{
//     console.log("Unhandled Rejection Detected... Server Shutting down...", err)

//     if(server){
//         server.close(()=>{
//             process.exit(1)
//         });
//     }

//     process.exit(1)
// })

// Promise.reject(new Error("I Forgot to catch this promise"))


// 2. UnCaught Rejection Error
// process.on("uncaughtException", (err)=>{
//     console.log("Uncaught Exception Detected... Server Shutting down...", err)

//     if(server){
//         server.close(()=>{
//             process.exit(1)
//         });
//     }

//     process.exit(1)
// })

// throw new Error("I Forgot to catch this local error")




// 2. Signal Termination 
process.on("SIGTERM", (err)=>{
    console.log("SIGTERM signal received... Server Shutting down...", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", (err)=>{
    console.log("SIGINT signal received... Server Shutting down...", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        });
    }

    process.exit(1)
})
