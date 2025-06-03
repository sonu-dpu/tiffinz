import { PaymentMode, PaymentStatus } from "@/constants/enum";
import { z } from "zod/v4";

export const addBalanceRequestSchema = z.object({
  userId: z.string(),
  amountAdded: z.number(),
  paymentMode:z.enum(PaymentMode),
  status: z.enum(PaymentStatus),
})

export type AddBalanceRequestInput = z.infer<typeof addBalanceRequestSchema>;