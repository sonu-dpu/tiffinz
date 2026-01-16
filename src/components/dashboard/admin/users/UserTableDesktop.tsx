"use client";
import { Button } from "@/components/ui/button";
import { IUser } from "@/models/user.model";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  users: IUser[];
  onVerify?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export const UserTableDesktop: React.FC<Props> = ({
  users,
  onVerify,
  onDelete,
}) => {
  const router = useRouter();
  const handleRowClick = (
    userId: string,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return; // Prevent navigation if a button was clicked
    }
    router.push(`/dashboard/users/${userId}`);
  };
  return (
    <div className="overflow-x-auto hidden md:block">
      <Table className="rounded-lg max-w-full">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead>Avatar</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={String(user._id)}
              onClick={(e) => handleRowClick(String(user._id), e)}
              className="cursor-pointer"
            >
              <TableCell>
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-md font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell>{user.username}</TableCell>

              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email || "-"}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>

              <TableCell>
                <Badge variant={user.isVerified ? "secondary" : "destructive"}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </TableCell>

              <TableCell>{getDateAndTimeString(user.createdAt!)}</TableCell>

              <TableCell className="space-x-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
