export async function updateByField(Model, field, value, data) {
  const updateData =
    data?.$set && Object.keys(data).length === 1
      ? data.$set
      : data;

  if (!updateData || typeof updateData !== "object") {
    throw new Error(`Invalid update data for ${Model.modelName}`);
  }

  if (updateData.$set) {
    throw new Error(
      `Nested $set detected in ${Model.modelName}. Pass plain fields instead.`
    );
  }

  console.log("Updating model:", Model.modelName);
  console.log("Update data:", JSON.stringify(updateData, null, 2));

  return Model.findOneAndUpdate(
    { [field]: value },
    { $set: updateData },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}