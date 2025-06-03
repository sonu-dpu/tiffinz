import connectDB from "@/utils/dbConnect";
import Meal from "@/models/meal.model";
import { ApiError } from "@/utils/apiError";
import { isValidObjectId } from "mongoose";

async function deleteMealById(id: string) {
  if (!isValidObjectId(id)) {
    throw new ApiError("Invalid Meal Id", 400);
  }
  await connectDB();

  const meal = await Meal.findById(id);
  if (!meal) {
    console.warn(`Attempt to delete non-existent meal with ID: ${id}`);
    throw new ApiError("Meal does not exists", 404);
  }
  await meal.deleteOne();
  return true;
}


async function deleteMealByIds(ids: string[]): Promise<number> {
    console.log('ids', ids)
  if (!Array.isArray(ids) || Array.isArray(ids) && ids.length === 0) {
    throw new ApiError("No Meal IDs provided", 400);
  }
  const invalidIds = ids.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new ApiError(`Invalid IDs: ${invalidIds.join(", ")}`, 400);
  }
  await connectDB();
  const { deletedCount } = await Meal.deleteMany({
    _id: { $in: ids },
  });

  if (deletedCount === 0) {
    throw new ApiError("No meals were deleted", 404);
  }

  return deletedCount;
}

export { deleteMealById, deleteMealByIds };
