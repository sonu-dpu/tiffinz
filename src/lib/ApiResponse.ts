import { NextResponse } from "next/server";
import { ZodError, z } from "zod/v4";

export type APIErrorDetail = ZodError | typeof Error |  Record<string, string[]> | string[] | string | unknown;
export class ApiResponse{
    static success<T>(message:string, data?:T, status:number=200){
        return NextResponse.json(
            {success:true, message, data},
            {status}
        );
    }
    static error(message: string, status: number=400, errors?: APIErrorDetail){
        return NextResponse.json(
            {success:false, message, errors},
            {status}
        )
    }

    static zodError(error: ZodError) {
    return this.error("Validation failed", 400, z.treeifyError(error));
  }
}