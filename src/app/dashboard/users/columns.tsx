"use client"

import { IUser } from "@/models/user.model"
import { ColumnDef } from "@tanstack/react-table"
import  Link  from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}



export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "_id",
    header: () => <div className="text-left">ID</div>,
    cell: ({ row }) => {
      const id = String(row.getValue("_id"))
      return <div className="text-left"><Link href={`/users/${id}`}>{id}</Link></div>
    }
  },
  {
    accessorKey: "isVerified",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const status = String(row.getValue("isVerified"))
      return <div className="text-left">{status}</div>
    }
  },
  {
    accessorKey:"email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => {
      const email = String(row.getValue("email"))
      return <div className="text-left">{email!=="undefined" ? <Link href={`mailto:${email}`}>{email}</Link> : "NULL"}</div>
    }
  },
]


