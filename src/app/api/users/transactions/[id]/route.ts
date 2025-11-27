import { UserRole } from "@/constants/enum";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { getTransactionById as getUserTransactionById } from "@/helpers/server/transactions";
type GetTransactionIdParams = {
  id: string;
};

// GET /api/users/transactions/:id 
// Get user transaction by id
export const GET = withAuth<GetTransactionIdParams>(
  async (req, context, user) => {
    const { id: transactionId } = await context.params;
    const userId = String(user?._id);
    if (!userId) {
      throw new ApiError("User not found");
    }
    if (!transactionId?.trim()) {
      throw new ApiError("Provide a valid transaction id");
    }

    const transaction = await getUserTransactionById(transactionId, userId);

    return ApiResponse.success("Transaction fetched successfully", {
      transaction,
    });
  },
  { requiredRole: UserRole.user }
);
