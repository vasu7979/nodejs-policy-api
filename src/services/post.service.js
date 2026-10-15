import {
  createScheduledPost,
  findDueScheduledPosts,
  claimScheduledPost,
  createPost,
  markScheduledPostCompleted,
  resetScheduledPost,
} from "../repositories/post.repository.js";

export async function schedulePost({ message, day, time }) {
  if (!message?.trim() || !day || !time) {
    throw new Error("message, day, and time are required");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error("day must use YYYY-MM-DD format");
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error("time must use HH:mm format");
  }

  const scheduledAt = new Date(`${day}T${time}:00`);

  if (
    Number.isNaN(scheduledAt.getTime()) ||
    scheduledAt.getFullYear() !== Number(day.slice(0, 4)) ||
    scheduledAt.getMonth() + 1 !== Number(day.slice(5, 7)) ||
    scheduledAt.getDate() !== Number(day.slice(8, 10))
  ) {
    throw new Error("Invalid scheduled date");
  }

  if (scheduledAt <= new Date()) {
    throw new Error("Scheduled date and time must be in the future");
  }

  return createScheduledPost({
    message: message.trim(),
    scheduledAt,
  });
}

export async function publishDuePosts() {
  const duePosts = await findDueScheduledPosts(new Date());

  for (const duePost of duePosts) {
    const claimedPost = await claimScheduledPost(duePost._id);

    if (!claimedPost) continue;

    try {
      await createPost({
        message: claimedPost.message,
        scheduledAt: claimedPost.scheduledAt,
      });

      await markScheduledPostCompleted(claimedPost._id);
    } catch (error) {
      await resetScheduledPost(claimedPost._id);
      console.error("Failed to publish scheduled post:", error.message);
    }
  }
}