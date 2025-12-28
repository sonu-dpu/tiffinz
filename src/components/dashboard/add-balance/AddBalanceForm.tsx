"use client";
import { Input } from "@/components/ui/input";
import LoaderButton from "@/components/ui/loader-button";
import { ImageKitFolder, PaymentMode } from "@/constants/enum";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadFile from "@/components/imagekit/UploadFile";
import { useForm } from "react-hook-form";
import {
  AddBalanceRequestInput,
  addBalanceRequestSchema,
} from "@/zod/addBalanceRequest.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBalanceRequest } from "@/helpers/client/add-balance";
import { toast } from "sonner";
import { z } from "zod/v4";
import { cn } from "@/lib/utils";

const addBalanceRequestSchemaClient = addBalanceRequestSchema.extend({
  amountAdded: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 50, "Amount must be greater than 50")
    .refine((val) => val <= 5000, "Amount must be less than 5,000"),
  paymentScreenshot: z.string().optional(),
});
function AddBalanceForm({ className = "" }: { className?: string }) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addBalanceRequestSchemaClient),
  });

  useEffect(() => {
    if (paymentMode) {
      setValue("paymentMode", paymentMode);
    }
    setValue(
      "paymentScreenshot",
      paymentMode === PaymentMode.online ? fileUrl || "" : ""
    );
  }, [paymentMode, fileUrl, setValue]);

  const handleSelect = (value: string) => {
    setFileUrl(null); // Reset file URL when payment mode changes
    console.log("selected payment mode:", value, fileUrl);
    setPaymentMode(value as PaymentMode);
  };
  console.log("errors", errors);
  const onSubmit = async (formData: AddBalanceRequestInput) => {
    // Validate payment screenshot for online payments
    if (paymentMode === PaymentMode.online && !fileUrl) {
      setError("paymentScreenshot", {
        type: "manual",
        message: "Payment screenshot is required for online payments.",
      });
      console.error("Payment screenshot is required for online payments.");
      return;
    }
    if (
      paymentMode === PaymentMode.cash &&
      !formData.paymentScreenshot?.trim()
    ) {
      delete formData.paymentScreenshot;
    }
    await makeAddBalanceRequest(formData);
  };

  async function makeAddBalanceRequest(formData: AddBalanceRequestInput) {
    const { data, error } = await addBalanceRequest(formData);
    if (error) {
      toast.error(error.message || "Failed to add balance request");
      setError("root", {
        type: "manual",
        message: error.message || "Failed to add balance request",
      });
      return;
    }
    reset();
    toast.success("Balance request added successfully!");
    console.log("Balance request added successfully:", data);
  }
  // console.log("fileUrl", fileUrl);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Add Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("amountAdded")}
              label="Amount"
              placeholder="Enter amount to add"
              type="number"
              errorMessage={errors.amountAdded?.message}
              className="w-full"
            />

            <label className="block mb-2 text-sm font-medium text-accent-foreground text-left">
              Select Payment Mode
              <Select onValueChange={handleSelect}>
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent {...register("paymentMode")}>
                  {Object.values(PaymentMode).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            {errors.paymentMode && (
              <span className="text-red-600 text-sm">
                {errors.paymentMode.message}
              </span>
            )}
          </div>
          {paymentMode === PaymentMode.online && (
            <UploadFile
              folder={ImageKitFolder.payments}
              setFileUrl={setFileUrl}
              errorMessage={errors.paymentScreenshot?.message}
              // {...register("paymentScreenshot", {required:false})} // Register the file input with react-hook-form
            />
          )}

          <LoaderButton
            fallbackText="Adding..."
            isLoading={isSubmitting}
            className="min-w-[150px]"
          >
            Add Balance{" "}
          </LoaderButton>
        </form>
        {errors.root && (
          <div className="mt-4 text-red-600 text-sm">
            {errors.root.message ||
              "An error occurred while submitting the form."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AddBalanceForm;
