import { UserRole } from "@/constants/enum";
import { getAllMealLogs } from "@/helpers/server/meals";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(
  async (req, _, user) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortType = (searchParams.get("sortType") as "asc" | "desc") || "desc";

    const orders = await getAllMealLogs(
      { userId: String(user?._id), sortType },
      { page, limit }
    );
    
    return ApiResponse.success("Fetched user orders successfully", { orders });
  },
  { requiredRole: UserRole.user },
);
