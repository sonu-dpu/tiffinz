import { UserRole } from "@/constants/enum";
import { getAllMealLogs, ISearchQuery } from "@/helpers/server/meals";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(
  async (req) => {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("user") || "";
    const username = searchParams.get("username") || "";
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";
    const sortType = searchParams.get("sortType") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const query: ISearchQuery = {
      userId,
      username,
      start,
      end,
      sortType: sortType === "asc" ? "asc" : "desc",
      // ...(sortType === "acs" ? {sortType:"asc"}: {sortType:"desc"})
    };

    // console.log('query', query)
    const mealLogs = await getAllMealLogs(query, { page, limit });

    return ApiResponse.success("Fetched meal logs successfully", mealLogs);
  },
  { requiredRole: UserRole.admin }
);
