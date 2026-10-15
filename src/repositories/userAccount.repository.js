import UserAccount from "../models/userAccount.model.js";

export async function updateUserAccount(accountName, userId, accountType) {
  return UserAccount.findOneAndUpdate(
    { accountName, userId },
    {
      $set: {
        accountName,
        userId,
        accountType: accountType || null,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}