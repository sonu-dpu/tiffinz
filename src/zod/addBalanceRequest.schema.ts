import { PaymentMode, PaymentStatus } from "@/constants/enum";
import { z } from "zod/v4";

const addBalanceRequestSchema = z.object({
  user: z.string().optional(),
  amountAdded: z.number().min(50, "Amount must be greater than 50").max(5000, "Amount must be less than or equal to 5000"),
  paymentMode: z.enum(PaymentMode),
  status: z.enum(PaymentStatus).optional(),
  paymentScreenshot: z.url("Must be a valid URL").optional(),
});

// const addBalanceRequestInput = addBalanceRequestSchema.extend({
//   userId: z.string().optional(),
//   status: z.enum(PaymentStatus).optional(),
// })


export { addBalanceRequestSchema };
export type AddBalanceRequestInput = z.infer<typeof addBalanceRequestSchema>;
