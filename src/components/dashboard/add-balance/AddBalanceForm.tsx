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

const addBalanceRequestSchemaClient = addBalanceRequestSchema.extend({
  amountAdded: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val > 50, "Amount must be greater than 50")
    .refine((val) => val <= 5000, "Amount must be less than 5,000"),
  paymentScreenshot: z.string().optional(),
});
function AddBalanceForm() {
  const [paymentMode, setPaymentMode] = useState<PaymentMode | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(addBalanceRequestSchemaClient),
  });

  useEffect(() => {
    if(paymentMode) {
      setValue("paymentMode", paymentMode);
    }
    setValue("paymentScreenshot", paymentMode === PaymentMode.online ? fileUrl || "" : "");
  }, [paymentMode, fileUrl, setValue]);

  const handleSelect = (value: string) => {
    setFileUrl(null); // Reset file URL when payment mode changes
    console.log("selected payment mode:", value, fileUrl);
    setPaymentMode(value as PaymentMode);
  };
  console.log("errors", errors, isLoading);
  const onSubmit = async (formData: AddBalanceRequestInput) => {
    console.log("Form data submiting:", formData);

    // Validate payment screenshot for online payments
    if (paymentMode === PaymentMode.online && !fileUrl) {
      setError("paymentScreenshot", {
      type: "manual",
      message: "Payment screenshot is required for online payments.",
      });
      console.error("Payment screenshot is required for online payments.");
      return;
    }

    // Remove empty paymentScreenshot for cash payments
    if (paymentMode === PaymentMode.cash && !formData.paymentScreenshot?.trim()) {
      delete formData.paymentScreenshot;
    }
    const { data, error } = await addBalanceRequest(formData);
    if (error) {
      toast.error(error.message || "Failed to add balance request");
      setError("root", {
        type: "manual",
        message: error.message || "Failed to add balance request",
      });
      console.error("Error adding balance request:", error);
      return;
    }
    toast.success("Balance request added successfully!");
    console.log("Balance request added successfully:", data);
  };
  // console.log("fileUrl", fileUrl);
  return (
    <Card className="w-full">
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
              className="w-full max-w-[300px]"
            />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 justify-items-start lg:w-[50%]">
              <div className="w-full">
                <label id="paymentMode" className="font-medium text-sm">
                  Select Payment Mode
                  <Select onValueChange={handleSelect}>
                    <SelectTrigger className="max-w-[300px] w-full">
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
            </div>
            <LoaderButton
              fallbackText=""
              isLoading={isLoading}
              className="min-w-[150px]"
            >
              Add Balance{" "}
            </LoaderButton>
          </div>
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
