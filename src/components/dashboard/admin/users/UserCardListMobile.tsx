"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Verified, X } from "lucide-react";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";


interface Props {
  users: IUser[];
  onVerify?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export const UserCardListMobile: React.FC<Props> = ({ users, onVerify, onDelete }) => {
  return (
    <div className="space-y-4 md:hidden">
      {users.map((user) => (
        <Card key={user._id?.toString()}>
          <CardHeader className="flex flex-row items-center gap-3">
            <Image
              src={"/profileAvatar.png"}
              alt={user.username || ""}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <CardTitle className="text-lg">
                <Link href={`/dashboard/users/${user._id}`}>{user.username}</Link>
              </CardTitle>
              <p className="text-sm text-gray-500">{user.fullName}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Email:</strong> {user.email || "-"}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p>
              {user.isVerified ? (
                <Badge variant={"success"}><Verified/> Verified</Badge>
              ) : (
                <Badge variant={"destructive"}><X/> Not Verified</Badge>
              )}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {getDateAndTimeString(String(user.createdAt))}
            </p>
            <div className="flex gap-2 pt-2">
              {onVerify && !user.isVerified && (
                <Button size="sm" onClick={() => onVerify(user)}>Verify</Button>
              )}
              {onDelete && (
                <Button size="sm" variant="destructive" onClick={() => onDelete(user)}>
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
