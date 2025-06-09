import { PaymentMode, PaymentStatus } from "@/constants/enum";
import { z } from "zod/v4";

const addBalanceRequestSchema = z.object({
  userId: z.string(),
  amountAdded: z.number().positive("Amount must be greater than 0"),
  paymentMode:z.enum(PaymentMode),
  status: z.enum(PaymentStatus),
  paymentScreenshot: z.url("Must be a valid URL").optional(),
})
const addBalanceRequestInput = addBalanceRequestSchema.extend({
  userId:z.string().optional(),
  status:z.enum(PaymentStatus).optional()
})

export {addBalanceRequestInput,addBalanceRequestSchema }
export type AddBalanceRequestInput = z.infer<typeof addBalanceRequestInput>;