import { IUser } from "@/models/user.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

type RouteContext<T = Record<string, never>> = {
  params: Promise<T>;
};
async function getCurrentUser(_req:NextRequest, _context:RouteContext, user:IUser | undefined):Promise<NextResponse> {
  return ApiResponse.success("Fetched user successfully", {user});
}

export {getCurrentUser}