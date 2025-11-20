import { UserRole } from "@/constants/enum";
import { createTransaction } from "@/helpers/server/transactions";
import { withAuth } from "@/utils/withAuth";

type MealParams = { id: string; mealId: string };
export const POST = withAuth<MealParams>(async (req, context) => {
    const { id: userId, mealId } = await context.params;
    const body = await req.json();
    // Logic to create a meal for the user with userId and mealId using body data


    // const transaction = await createTransaction()
    console.log({body, userId, mealId});
    
    return new Response("Meal created", { status: 201 });
  },
  { requiredRole: UserRole.admin }
);
