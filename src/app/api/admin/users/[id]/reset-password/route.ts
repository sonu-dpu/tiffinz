import { UserRole } from "@/constants/enum";
import { generatePasswordResetLink } from "@/helpers/server/admin.user";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";

const generatePasswordResetLinkRoute = withAuth<{ id: string }>(
  async (req, context) => {
    const { id: userId } = await context.params;
    // Implement the logic to reset the user's password here
    // console.log("req.url", req.nextUrl.origin);
    const { resetLink, tokenExpiration } = await generatePasswordResetLink(
      userId,
      { baseUrl: req.nextUrl.origin },
    );
    return ApiResponse.success(
      "User password reset token generated successfully",
      { resetLink, expiresAt: tokenExpiration },
    );
  },
  { requiredRole: UserRole.admin },
);

export const GET = generatePasswordResetLinkRoute;
