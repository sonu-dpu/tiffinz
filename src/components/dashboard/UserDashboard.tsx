import { IUser } from "@/models/user.model";
import OrderMeal from "./orders/OrderMeal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListOrdered, UtensilsCrossed } from "lucide-react";

function UserDashboard({ user }: { user: IUser }) {
  return (
    <div className="px-2 pb-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          Welcome, {user.fullName}!
        </h1>
        <p className="text-muted-foreground mb-6">What would you like to do today?</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
         <Button asChild className="h-12 flex-1 sm:flex-none">
           <Link href="#order-tiffin-section" className="flex items-center gap-2">
             <UtensilsCrossed className="w-5 h-5" />
             <span className="text-md">Order a Tiffin</span>
           </Link>
         </Button>
         <Button asChild variant="secondary" className="h-12 flex-1 sm:flex-none">
           <Link href="/dashboard/orders" className="flex items-center gap-2">
             <ListOrdered className="w-5 h-5" />
             <span className="text-md">View Ordered Tiffins</span>
           </Link>
         </Button>
      </div>

      <div id="order-tiffin-section" className="scroll-mt-20">
         <OrderMeal />
      </div>
    </div>
  );
}

export default UserDashboard;
