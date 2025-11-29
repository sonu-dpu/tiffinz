import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/constants/enum";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { formatToIndianCurrency } from "@/lib/utils";
import { ITransactionWithUser } from "@/models/transaction.model";
import { MinusIcon, PlusIcon } from "lucide-react";

function TransactionsCard({ transaction }:{transaction: ITransactionWithUser}) {
  const transactionType = transaction.type == TransactionType.credit;
  const date = getDateAndTimeString(transaction.createdAt!);
  const amount = formatToIndianCurrency(transaction.amount)
  return (
    <Card>
      <CardContent className="">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text">{transaction.user.fullName}</CardTitle>
            <div className="text-xs pt-2 text-muted-foreground">
              <p >
                Transaction Id : {String(transaction._id)}
              </p>
              <p className="text-xs">{date}</p>
            </div>
          </div>
          <Badge
            className="border-none font-bold text-sm"
            variant={transactionType ? "success" : "destructive"}
          >
            {transactionType ? <PlusIcon /> : <MinusIcon />}{" "}
            {amount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionsCard;
