import express from "express";
import { createScheduledPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/schedule", createScheduledPost);

export default router;