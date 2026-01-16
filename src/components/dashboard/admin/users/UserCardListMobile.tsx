"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Verified, X } from "lucide-react";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  users: IUser[];
  onVerify?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export const UserCardListMobile: React.FC<Props> = ({
  users,
  onVerify,
  onDelete,
}) => {
  return (
    <div className="space-y-4 md:hidden">
      {users.map((user) => (
        <Card key={user._id?.toString()}>
          <Link href={`/dashboard/users/${user._id}`}>
            <CardHeader className="flex flex-row justify-between items-center gap-3">
              {/* <div className="flex justify-between w-full items-center"> */}
              <div className="flex gap-2">
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-md font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">
                  {user.username}
                  <p className="text-sm text-muted-foreground">
                    {user.fullName}
                  </p>
                </CardTitle>
              </div>
              {user.isVerified ? (
                <Badge variant={"default"}>
                  <Verified /> Verified
                </Badge>
              ) : (
                <Badge variant={"destructive"}>
                  <X /> Not Verified
                </Badge>
              )}
              {/* </div> */}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {user.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {getDateAndTimeString(String(user.createdAt))}
              </p>
              <div className="flex gap-2 pt-2">
                {onVerify && !user.isVerified && (
                  <Button size="sm" onClick={() => onVerify(user)}>
                    Verify
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};
