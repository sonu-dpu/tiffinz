import { UserRole } from "@/constants/enum";
import { getAllMealLogs, ISearchQuery } from "@/helpers/server/meals";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(
  async (req, _context, user) => {
    const { searchParams } = req.nextUrl;
    const query: ISearchQuery = {
      userId: searchParams.get("user") || "",
      username: searchParams.get("username") || "",
      start: searchParams.get("start") || "",
      end: searchParams.get("end") || "",
      sortType: searchParams.get("sortType") === "asc" ? "asc" : "desc",
    };
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    console.log("Received query params for meal logs:", query, { page, limit });
    if (user?.role === UserRole.user) {
      query.userId = String(user._id);
    }

    const mealLogs = await getAllMealLogs(query, { page, limit });

    return ApiResponse.success("Fetched meal logs successfully", mealLogs);
  },
  { requiredRole: UserRole.user },
);
