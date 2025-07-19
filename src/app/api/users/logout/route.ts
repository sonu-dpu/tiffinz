import { logoutUser } from "@/helpers/server/user.auth";
import { withAuth } from "@/utils/withAuth";

export const GET = withAuth(async(req)=>{
  return await logoutUser(req);
})