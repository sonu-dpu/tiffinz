import { UserRole } from "@/constants/enum";
import AddBalanceRequest from "@/models/addBalanceRequest.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(
  async () => {
    // const searchParams = req.nextUrl.searchParams;
    // const status = searchParams.get("status");
    // const match:Record<keyof AddBalanceRequestInput, string> = {};
    // if(status){
    //     match.status = status;
    // }
    const requests = await AddBalanceRequest.find().populate({path:"user", select:"-password"});
    if (!requests) {
      return ApiResponse.error("no requests found", 404);
    }
    return ApiResponse.success(
      "Fetched equest successfully",
      { requests },
      200
    );
  },
  {
    requiredRole: UserRole.admin,
  }
);

