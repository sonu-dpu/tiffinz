import axios from "axios";
import { helperResponse } from "./client.types";
import { handleError } from "@/lib/handleError";

async function getCurrentUserAccount():Promise<helperResponse>{
    try {
        const resp = await axios.get("/api/accounts");
        const data = resp.data?.data?.account
        return {data, error:null}
    } catch (error) {
        return {data:null, error:handleError(error, "account error")}
    }
}
export {getCurrentUserAccount}