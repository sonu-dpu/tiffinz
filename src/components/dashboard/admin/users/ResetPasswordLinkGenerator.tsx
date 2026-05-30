"use client";

import QRCode from "react-qr-code";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generatePasswordResetLink } from "@/helpers/client/admin.users";
import Loader from "@/components/ui/Loader";

type ResetPasswordLinkGeneratorProps = {
  userId: string;
  isConfirmed: boolean;
};

function ResetPasswordLinkGenerator({
  userId,
  isConfirmed,
}: ResetPasswordLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["generateResetPasswordLink", userId],
    queryFn: () => generatePasswordResetLink(userId),
    enabled: Boolean(userId) && isConfirmed,
  });

  const copyLink = async () => {
    if (!data?.resetLink) return;

    await navigator.clipboard.writeText(data.resetLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading || isFetching) {
    return (
      <div>
        <p>Generating Password Reset Link</p>
        <Loader></Loader>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failed to generate reset link</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!data?.resetLink) return null;

  const { resetLink } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this link with the user</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={resetLink} size={220} />
          </div>
        </div>

        <div className="flex gap-2">
          <Input value={resetLink} readOnly />

          <Button variant="outline" size="icon" onClick={copyLink}>
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResetPasswordLinkGenerator;
