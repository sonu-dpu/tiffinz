import axios from "axios";

async function getUserTransactions(options?: { page?: number }) {
  try {
    const resp = await axios.get(
      `/api/users/transactions?page=${options?.page || 1}`
    );
    return resp.data?.data;
  } catch (error) {
    console.log('error', error)
    throw new Error("Failed to fetch user transactions");
  }
}



export { getUserTransactions };