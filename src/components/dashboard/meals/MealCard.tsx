"use client";
import { IMeal } from "@/models/meal.model";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDateAndTimeString } from "@/lib/getDateAndTimeString";
import { EditIcon, Ellipsis, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { WithAlert } from "@/components/WithAlert";
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/constants/enum";
import { QueryClientContext, useMutation } from "@tanstack/react-query";
import { deleteMealById } from "@/helpers/client/admin.meals";
import { toast } from "sonner";
import { useContext } from "react";
function MealCard({
  meal,
  listOnly = false,
}: {
  meal: IMeal;
  listOnly?: boolean;
}) {
  const { userRole } = useCurrentUser();
  return (
    // <Link href={`/dashboard/meals/${meal._id}`}>
    <Card>
      <CardHeader>
        <CardTitle>
          {meal.name} - {meal.type}
        </CardTitle>
        <CardAction>
          {userRole === UserRole.admin && <MealActionMenu meal={meal} />}
        </CardAction>
        <Badge color={meal.isActive ? "green" : "red"}>
          {meal.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent>
        <p>
          <strong>Price:</strong> ₹{meal.price}
        </p>
        <p>
          <strong>Description:</strong> {meal.description}
        </p>
        <p>
          <small>Created at: {getDateAndTimeString(meal.createdAt!)}</small>
        </p>
        {/* {!listOnly && (
          <CardFooter className="flex justify-end">
            <Link href={`/dashboard/meals/${meal._id}`}>
              <Button disabled={!meal.isActive}>Order Now</Button>
            </Link>
          </CardFooter> */}
        {/* )} */}
      </CardContent>
    </Card>
    // </Link>
  );
}

function MealActionMenu({ meal }: { meal: IMeal }) {
  const client = useContext(QueryClientContext);
  const deleteMealMutation = useMutation({
    mutationFn: (mealId: string) => {
      toast.loading("Deleting meal...", { id: "delete-meal" });
      return deleteMealById(mealId);
    },
    onSuccess(_) {
      toast.dismiss("delete-meal");
      client?.invalidateQueries({
        queryKey: ["getAllMeals"],
      });
      toast.success("Meal deleted successfully");
    },
    onError: (error) => {
      toast.dismiss("delete-meal");
      toast.error(error.message || "Something went wrong");
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Ellipsis className="rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-20">
        <DropdownMenuItem>
          Edit
          <EditIcon />
        </DropdownMenuItem>
        <DropdownMenuItem>Toggle Status</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <WithAlert
            title="Confirm to delete the meal"
            onConfirm={() => deleteMealMutation.mutate(String(meal._id))}
            trigger={
              <Button className="w-full bg-transparent" variant={"destructive"}>
                Delete
                <Trash2 />
              </Button>
            }
          >
            <div className="text-muted-foreground">
              <p>Are you sure you want to delete the meal?</p>
              <p>{meal.name} </p>
              <p> This action cannot be undone.</p>
            </div>
          </WithAlert>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default MealCard;
