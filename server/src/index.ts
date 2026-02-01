import { Server } from "node:http";
import mongoose from "mongoose";
import express from "express";
import {connectDB} from "./configs/db.js"
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(errorHandler);

let server:Server;

connectDB().then(() => {
  console.log(`DB connection established!`);
  server = app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("DB connection failed", err);
  process.exit(1);
});

const gracefulShutdown = async () => {
  console.log("\nStaring graceful shutdown...");
  if(server){
    server.close(async() => {
      console.log("HTTP server closed.");
      await mongoose.disconnect();
      console.log("Mongoose connection closed.");
      process.exit(0);
    })
  } else{
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);

