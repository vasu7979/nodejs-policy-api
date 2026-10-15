import Policy from "../models/policy.model.js";

export async function updatePolicy(data) {
  if (!data || !data.policyNumber) {
    throw new Error("Policy number is required");
  }

  if (data.$set) {
    throw new Error(
      "Nested $set detected in updatePolicy(). Pass plain policy fields."
    );
  }

  console.log(
    "Updating Policy:",
    JSON.stringify(data, null, 2)
  );

  return Policy.findOneAndUpdate(
    { policyNumber: data.policyNumber },
    { $set: data },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function findPoliciesByUsername(username) {
  const policies = await Policy.find()
    .populate({
      path: "userId",
      match: {
        firstName: {
          $regex: `^${escapeRegex(username)}$`,
          $options: "i",
        },
      },
      select: "firstName email phoneNumber",
    })
    .populate("policyCategoryId", "categoryName")
    .populate("companyId", "companyName")
    .populate("agentId", "agentName")
    .populate("accountId", "accountName accountType");

  return policies.filter((policy) => policy.userId !== null);
}


function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export async function aggregatePoliciesByUser() {
  return Policy.aggregate([
    {
      $group: {
        _id: "$userId",
        totalPolicies: { $sum: 1 },
        policies: {
          $push: {
            policyNumber: "$policyNumber",
            policyStartDate: "$policyStartDate",
            policyEndDate: "$policyEndDate",
            policyCategoryId: "$policyCategoryId",
            companyId: "$companyId",
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        username: "$user.firstName",
        email: "$user.email",
        totalPolicies: 1,
        policies: 1,
      },
    },
    { $sort: { username: 1 } },
  ]);
}