import { z } from "zod/v4";
import { TransactionType } from "@/constants/enum"; // adjust import

export const UpdateUserAccountBalanceSchema = z.object({
  amount: z.number(),
  accountId: z.string().optional(),
  userId: z.string().optional(),
  type: z.enum(TransactionType),
});

export type UpdateUserAccountBalanceParams = z.infer<
  typeof UpdateUserAccountBalanceSchema
>;
