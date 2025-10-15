import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/constants/enum";
import { ITransaction } from "@/models/transaction.model";
import { MinusIcon, Plus, PlusIcon } from "lucide-react";
import React from "react";

function TransactionsCard({ transaction }: { transaction: ITransaction }) {
  const transactionType = transaction.type == TransactionType.credit;
  const date = new Date(String(transaction?.createdAt)).toString().slice(0, 24);
  return (
    <Card>
      <CardContent className="">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text">{transaction.user?.username}</CardTitle>
            <div className="text-xs pt-2 text-muted-foreground">
              <p >
                Trsanction Id : {String(transaction._id)}
              </p>
              <p className="text-xs">{date}</p>
            </div>
          </div>
          <Badge
            className="border-none font-bold text-sm"
            variant={transactionType ? "success" : "destructive"}
          >
            {transactionType ? <PlusIcon /> : <MinusIcon />}{" "}
            {transaction.amount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionsCard;
