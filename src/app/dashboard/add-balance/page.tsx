import AddBalanceForm from "@/components/dashboard/add-balance/AddBalanceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

function AddBalancePage() {
  return (
    <div>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Add Balance</CardTitle>{" "}
        </CardHeader>
        <CardContent>

            <AddBalanceForm/>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddBalancePage;
