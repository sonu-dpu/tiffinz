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
async function getUserTransactionById(transactionId: string) {
  try {
    const resp = await axios.get(`/api/users/transactions/${transactionId}`); 
    return resp.data?.data.transaction;
  } catch (error) {
    console.log('error', error)
    throw new Error("Failed to fetch transaction details");
  }
}


export { getUserTransactions, getUserTransactionById };