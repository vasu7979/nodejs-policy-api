import cron from "node-cron";
import { publishDuePosts } from "../services/post.service.js";

export function startPostScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      await publishDuePosts();
    } catch (error) {
      console.error("Post scheduler error:", error.message);
    }
  });

  console.log("Post scheduler started");
}