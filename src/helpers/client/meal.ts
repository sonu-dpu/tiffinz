import { handleError } from "@/lib/handleError";
import axios from "axios";

async function getAllMeals({ isActive = true }: { isActive?: boolean }) {
  try {
    const resp = await axios.get(`/api/meals?isActive=${isActive}`);
    const data = resp.data?.data;
    return data;
  } catch (error) {
    const errMessage = handleError(error, "get all meals").message;
    throw new Error(errMessage);
  }
}

async function getMealById(id: string) {
  try {
    const resp = await axios.get(`/api/meals/${id}`);
    const data = resp.data?.data;
    console.log('data', data)
    return data?.meal;
  } catch (error) {
    const errMessage = handleError(error, "get all meals").message;
    throw new Error(errMessage);
  }
}
export { getAllMeals, getMealById };
