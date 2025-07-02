import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from "@/models/user.model";
import Image from "next/image";
import React, { useMemo, useState } from "react";

interface UserTableProps {
  users: IUser[];
  onVerify?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onVerify, onDelete }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users;
    return users.filter((user) =>
      user.username?.toLowerCase().includes(s) ||
      user._id?.toString().toLowerCase().includes(s) ||
      user.email?.toLowerCase().includes(s) ||
      user.phone?.toLowerCase().includes(s)
    );
  }, [users, search]);

  return (
    <div className="p-4">
      <div className="mb-4 flex">
        <Input
          type="text"
          placeholder="Search by username, id, email, phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
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
          {filteredUsers.map((user) => (
            <tr key={user._id?.toString()} className="text-center hover:bg-gray-50">
              <td className="px-4 py-2 border-b">
                <Image
                  src={"/profileAvatar.png"}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mx-auto"
                />
              </td>
              <td className="px-4 py-2 border-b">{user.username}</td>
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
                {new Date(String(user.createdAt)).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b space-x-2">
                {onVerify && !user.isVerified && (
                  <Button
                    onClick={() => onVerify(user)}
                  >
                    Verify
                  </Button>
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
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 py-8">No users found.</div>
      )}
    </div>
  );
};
