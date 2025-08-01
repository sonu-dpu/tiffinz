import { UserRole } from "@/constants/enum";
import {
  getUserById,
  getUserByIdWithAccount,
} from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

type UserIdParams = { id: string };
export const GET = withAuth<UserIdParams>(
  async (req, context) => {
    const didRequestedFull = req.nextUrl.searchParams.get("full");
    const { id } = await context.params;
    if (didRequestedFull) {
      const { user } = await getUserByIdWithAccount(id);
      return ApiResponse.success(
        "User details fetched successfully",
        { user },
        200
      );
    }
    const user = await getUserById(id);
    return ApiResponse.success("User details fetched", { user });
  },
  { requiredRole: UserRole.admin }
);
