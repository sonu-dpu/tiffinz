import { getCurrentUser } from "@/controllers/user.controllers";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(getCurrentUser)