import { mealLogSchemaForAdminClientType } from "@/zod/mealLog.schema";
import axios from "axios";

async function markMealTakenByUser(data: mealLogSchemaForAdminClientType) {
  try {
    const payload = { ...data, date: new Date() };
    const resp = await axios.post(
      `/api/admin/meals/${data.meal}/order/u/${data.user}`,
      payload
    );
    return resp.data?.data;
  } catch (error) {
    throw new Error("Error marking meal as taken: " + String(error));
  }
}

export { markMealTakenByUser };
