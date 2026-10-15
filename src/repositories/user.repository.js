import User from "../models/user.model.js";

export async function updateUser(userMatch, userData) {
  return User.findOneAndUpdate(
    userMatch,
    { $set: userData },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}