"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IUser } from "@/models/user.model";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";


interface Props {
  users: IUser[];
  onVerify?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export const UserTableDesktop: React.FC<Props> = ({ users, onVerify, onDelete }) => {
  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="max-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Avatar</th>
            <th className="px-4 py-2 border-b">Username</th>
            <th className="px-4 py-2 border-b">Full Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Phone</th>
            <th className="px-4 py-2 border-b">Role</th>
            <th className="px-4 py-2 border-b">Verified</th>
            <th className="px-4 py-2 border-b">Created</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id?.toString()} className="text-center hover:bg-gray-50">
              <td className="px-4 py-2 border-b">
                <Image
                  src={"/profileAvatar.png"}
                  alt={user.username || ""}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mx-auto"
                />
              </td>
              <td className="px-4 py-2 border-b">
                <Link href={`/dashboard/users/${user._id}`}>{user.username}</Link>
              </td>
              <td className="px-4 py-2 border-b">{user.fullName}</td>
              <td className="px-4 py-2 border-b">{user.email || "-"}</td>
              <td className="px-4 py-2 border-b">{user.phone}</td>
              <td className="px-4 py-2 border-b">{user.role}</td>
              <td className="px-4 py-2 border-b">
                {user.isVerified ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </td>
              <td className="px-4 py-2 border-b">
                {getDateAndTimeString(user.createdAt!)}
              </td>
              <td className="px-4 py-2 border-b space-x-2">
                {onVerify && !user.isVerified && (
                  <Button onClick={() => onVerify(user)}>Verify</Button>
                )}
                {onDelete && (
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
