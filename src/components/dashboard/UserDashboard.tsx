import { IUser } from "@/models/user.model";
// import React from "react";
// import OrderMeal from "./orders/OrderMeal";
import MealsContainer from "./meals/MealsContainer";

function UserDashboard({ user }: { user: IUser }) {
  return (
    <div className="px-2">
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          Welcome, {user.fullName}!
        </h1>
      </div>
      {/* <OrderMeal /> */}
      <MealsContainer />
    </div>
  );
}

export default UserDashboard;
