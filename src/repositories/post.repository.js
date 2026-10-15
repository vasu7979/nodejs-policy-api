import ScheduledPost from "../models/scheduledPost.model.js";
import Post from "../models/post.model.js";

export function createScheduledPost(data) {
  return ScheduledPost.create(data);
}

export function findDueScheduledPosts(now) {
  return ScheduledPost.find({
    status: "pending",
    scheduledAt: { $lte: now },
  });
}

export function claimScheduledPost(id) {
  return ScheduledPost.findOneAndUpdate(
    { _id: id, status: "pending" },
    { $set: { status: "processing" } },
    { returnDocument: "after" }
  );
}

export function createPost(data) {
  return Post.create(data);
}

export function markScheduledPostCompleted(id) {
  return ScheduledPost.findByIdAndUpdate(id, {
    $set: { status: "completed" },
  });
}

export function resetScheduledPost(id) {
  return ScheduledPost.findByIdAndUpdate(id, {
    $set: { status: "pending" },
  });
}