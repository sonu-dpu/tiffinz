
import { ApiResponse } from "@/lib/ApiResponse";
import User from "@/models/user.model";
import { asyncHandler } from "@/utils/asyncHandler";
import  jwt, { JwtPayload }  from "jsonwebtoken";
interface MyJwtPayload extends JwtPayload {
  _id: string;
  role?: string; 
}
export const GET = asyncHandler(async(req)=>{
    const token = req.cookies.get("accessToken")?.value;
    if(!token){
        return ApiResponse.error("Token not found", 400)
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as MyJwtPayload;
    const userId = decodedToken?._id
    if(!userId){
        return ApiResponse.error("Token Expired", 400)
    }
    const user = await User.findById(userId).select("-password");
    if(!user){
        return ApiResponse.error("User not found", 404)
    }
    return ApiResponse.success("Fetched user details succcessfully", user)
})