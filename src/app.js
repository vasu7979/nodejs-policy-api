import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import importRoutes from "./routes/import.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import policyRoutes from "./routes/policy.routes.js";
import postRoutes from "./routes/post.routes.js";
import { startPostScheduler } from "./jobs/post.scheduler.js";
import { startCpuMonitor } from "./monitor/cpu.monitor.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/import", importRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/posts", postRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
startPostScheduler();
startCpuMonitor();