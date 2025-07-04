import { PaymentMode, PaymentStatus } from "@/constants/enum";
import { z } from "zod/v4";

const addBalanceRequestSchema = z.object({
  userId: z.string().optional(),
  amountAdded: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Amount must be greater than 0")
    .refine((val) => val <= 5000, "Amount must be less than 5,000"),
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
