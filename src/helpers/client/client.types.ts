import { IMeal } from "@/models/meal.model";
import { IMealLog } from "@/models/mealLogs.model";
import { IUser } from "@/models/user.model";
import { AggregatePaginateResult } from "mongoose";

export type helperResponse<T=unknown> = {
  data: T | null;
  error: {
    type: string;
    message: string;
  } | null;
};
export type ExtraMealType={
      _id:string,
      name:string,
      price:number,
      description:string
}

// meal log with meal details
export type MealLogPopulatedType = Omit<IMealLog, "extras"> & {
  meal:IMeal;
  user:IUser;
  extras?:{
    quantity:number,
    details:ExtraMealType
  }[],
  priceBreakdown:{
    baseAmount:number,
    extrasTotal?:number,
    total:number,
  }
}

export type PaginatedResult<T> = AggregatePaginateResult<T>

