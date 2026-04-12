import { DailyMealFor, MealStatus } from "@/constants/enum";
import { mealLogSchemaForAdminClientType } from "@/zod/mealLog.schema";
import { MealInput } from "@/zod/meals.schema";
import axios from "axios";

async function markMealTakenByUser(data: mealLogSchemaForAdminClientType) {
  try {
    const resp = await axios.post(
      `/api/admin/meals/${data.meal}/order/u/${data.user}`,
      data,
    );
    return resp.data?.data;
  } catch (error) {
    throw new Error("Error marking meal as taken: " + String(error));
  }
}
async function addNewMeal(data: MealInput) {
  try {
    const resp = await axios.post("/api/admin/meals/", data);
    console.log("resp", resp);
    if (!resp.data?.success) {
      throw new Error("Failed to create meal");
    }
    return resp.data?.data;
  } catch (error) {
    throw new Error("Error: addNewMeal " + String(error));
  }
}

async function deleteMealById(mealId: string) {
  try {
    const resp = await axios.delete(`/api/admin/meals/${mealId}`);
    return resp.data;
  } catch (error) {
    throw new Error("Error: deleteMeal " + String(error));
  }
}
async function updateMealById(mealId: string, data: MealInput) {
  try {
    const resp = await axios.patch(`/api/admin/meals/${mealId}`, data);
    return resp.data?.data;
  } catch (error) {
    throw new Error("Error: updateMeal " + String(error));
  }
}
type GetMealOrderProps = {
  date?: string;
  status?: MealStatus;
  mealFor?: DailyMealFor;
};
async function getMealOrders(options: GetMealOrderProps) {
  try {
    const resp = await axios.get(
      `/api/admin/meals/orders?status=${options.status}&mealFor=${options.mealFor}`,
    );
    return resp.data?.data;
  } catch (error) {
    throw new Error("Error: getMealOrders " + String(error));
  }
}

export {
  markMealTakenByUser,
  addNewMeal,
  deleteMealById,
  updateMealById,
  getMealOrders,
};
