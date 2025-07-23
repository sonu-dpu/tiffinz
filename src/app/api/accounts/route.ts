import { createAccount, getUserAccount } from "@/helpers/server/user.account";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { withAuth } from "@/utils/withAuth";

export const POST = asyncHandler(async(req)=>{
  const userId = req.headers.get("x-user-id");
  if(!userId){
    return ApiResponse.error("User id required");
  }
  const newAccount = await createAccount(userId);
  if(!newAccount){
    return ApiResponse.error("Failed to create user Acccout", 500)
  }
  return ApiResponse.success("Accout create successfully", {account: newAccount}, 201)
})


// export const DELETE = asyncHandler(async(req)=>{

// })

export const GET = withAuth(async(_req, _context, user)=>{
  const userId = String(user?._id)
  const account = await getUserAccount(userId);
  return ApiResponse.success("Account details fetched successfully", {account}, 200)
})