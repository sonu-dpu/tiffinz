"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { TransactionType } from "@/constants/enum";
import { getTransactionById } from "@/helpers/client/admin.transactions";
import { cn, formatToIndianCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import {BadgeCheck } from "lucide-react";
import { useParams } from "next/navigation";

function TransactionDetailsPage() {
  const { id } = useParams();
  const { data, error, isFetching } = useQuery({
    queryKey: ["getTransactionById", id],
    queryFn: () => getTransactionById(id as string),
    refetchOnWindowFocus:false
  });
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isFetching) {
    return <Loader />;
  }
  console.log("data", data);
  const isCredit = data.type === TransactionType.credit;
  const amount = `${isCredit? "+":"- "} ${formatToIndianCurrency(data.amount)}`
  return (
    <div className="bg-muted/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow border border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Transaction Details
          </CardTitle>
          <p className="text-sm opacity-90 mt-1">
            Transaction ID: {data._id}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 bg-amber-200 rounded-full flex justify-center items-center">
                <AvatarImage src={data.user.avatar} alt={data.user.fullName} />
                <AvatarFallback>
                  {data.user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{data.user.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  @{data.user.username}
                </p>
              </div>
            </div>
            <Badge
              variant={data.user.isVerified ? "default" : "outline"}
            >
              <BadgeCheck/>
              {data.user.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Amount:</span>
              <p className={cn(
                "text-lg font-bold",
              )}>
                {amount}
              </p>
            </div>

            <div>
              <span className="font-medium text-muted-foreground">Type:</span>
              <p>
                <Badge
                  variant="outline"
                >
                  {data.type}
                </Badge>
              </p>
            </div>

            <div>
              <span className="font-medium text-muted-foreground">Account:</span>
              <p className="text-foreground">{data.account}</p>
            </div>

            <div>
              <span className="font-medium text-muted-foreground">Phone:</span>
              <p>{data.user.phone}</p>
            </div>
          </div>

          {/* <Separator  /> */}

          {/* Meta Info */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Updated:</span>{" "}
              {new Date(data.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionDetailsPage;
