import { UserRole } from "@/constants/enum";
import { getAllTransactions } from "@/helpers/server/admin.transactions";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import { PaginateOptions } from "mongoose";

export const GET = withAuth(
  async (req) => {
    const searchParams = req.nextUrl.searchParams;
    const paginateOptions: PaginateOptions = {
      limit: Number(searchParams.get("limit")) || 10,
      page: Number(searchParams.get("page") || 1),
      sort: { createdAt: -1 },
    };
    const searchOptions = {
      user: searchParams.get("user") || "",
    };
    const transactions = await getAllTransactions({
      paginateOptions,
      searchOptions,
    });
    return ApiResponse.success("Get transactions success", transactions, 200);
  },
  {
    requiredRole: UserRole.admin,
  }
);
