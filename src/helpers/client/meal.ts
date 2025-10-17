import { handleError } from "@/lib/handleError"
import axios from "axios";

async function getAllMeals(){
  try {
    const resp = await axios.get("/api/meals");
    const data = resp.data?.data;
    return data
  } catch (error) {
    const errMessage = handleError(error, "get all meals").message;
    throw new Error(errMessage)
  }
}


export {getAllMeals}