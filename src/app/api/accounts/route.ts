import { createAccount } from "@/services/server/user.accountService";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

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