"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Verified, X } from "lucide-react";
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
            <CardHeader className="flex flex-row flex-wrap justify-between items-center gap-2 mb-2">
              {/* <div className="flex justify-between w-full items-center"> */}
              <div className="flex items-center gap-2">
                <Avatar className="h-14 w-14 rounded-full overflow-hidden">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-md font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="truncate max-w-[150px]">
                  {user.username}
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    {user.fullName}
                    {user.isVerified ? (
                      <Verified className="w-4 h-4 text-card" fill="#238636" />
                    ) : (
                      <X />
                    )}
                  </div>
                </CardTitle>
              </div>
              <Badge variant={"outline"} className="w-max mx-2">
                {user.role}
              </Badge>
              {/* </div> */}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="w-4" /> {user.email || "NA"}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-4" /> {user.phone}
                </div>
              </div>
              {/* <p>
                <strong>Created:</strong>{" "}
                {getDateAndTimeString(String(user.createdAt))}
              </p> */}
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
