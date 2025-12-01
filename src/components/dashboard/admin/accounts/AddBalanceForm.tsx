"use client";

import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoaderButton  from "@/components/ui/loader-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { TransactionType } from "@/constants/enum";
import { addBalanceToUserAccount } from  "@/helpers/client/admin.accounts";
type AddBalanceInput = {
  amount: number;
};

export default function AddBalanceForm({ className }: { className?: string }) {
  const {id: userId} = useParams();
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddBalanceInput>();

  const onSubmit = async (data: AddBalanceInput) => {
    try {
      console.log("Submitting:", data);
      const document = {
        amount: data.amount,
        userId: userId as string,
        type:TransactionType.credit,
      };
      // TODO: call your API here
      const {transaction} = await addBalanceToUserAccount(document);
      router.push(`/dashboard/transactions/${transaction._id}`)
      toast.success("Balance updated!");
      reset();
    } catch (error) {
      toast.error("Failed to update balance");
      setError("root", { message: "Unable to update balance" });
      console.error("Error updating balance:", error);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Add Balance</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Amount */}
          <div className="space-y-2">
            <Input
              type="number"
              {...register("amount", {
                required: "Amount is required",
                setValueAs: (v) => Number(v),
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              label="Amount"
              placeholder="Enter amount"
              errorMessage={errors.amount?.message}
            />
          </div>

          {/* Submit Button */}
          <LoaderButton
            fallbackText="Saving..."
            isLoading={isSubmitting}
            className="min-w-[150px]"
          >
            Add Balance
          </LoaderButton>
        </form>

        {/* Root level form error */}
        {errors.root && (
          <div className="mt-4 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
