import { schedulePost } from "../services/post.service.js";

export async function createScheduledPost(req, res, next) {
  try {
    console.log("Request body:", req.body);

    const scheduledPost = await schedulePost(req.body);

    return res.status(201).json({
      success: true,
      message: "Post scheduled successfully",
      data: scheduledPost,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return res.status(400).json({
        success: false,
        message: "Please send a valid JSON request body",
      });
    }

    next(error);
  }
}