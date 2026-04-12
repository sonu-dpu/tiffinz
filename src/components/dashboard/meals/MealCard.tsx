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
import { getDateAndTimeString } from "@/lib/date-format";
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
import { useContext, useState } from "react";
import DialogWrapper from "@/components/ui/dialog-wrapper";
import EditMealForm from "./EditMealForm";
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
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              {meal.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {meal.type}
              </Badge>
              <Badge
                variant={meal.isActive ? "default" : "destructive"}
                className={
                  meal.isActive
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                    : ""
                }
              >
                {meal.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <CardAction>
            {userRole === UserRole.admin && <MealActionMenu meal={meal} />}
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <p>
          <strong>Price:</strong> ₹{meal.price}
        </p>
        <p className="line-clamp-2">
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
    <>
      <DialogWrapper
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Meal"
      >
        <EditMealForm
          meal={meal}
          onSuccess={() => setIsEditDialogOpen(false)}
        />
      </DialogWrapper>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Ellipsis className="h-4 w-4 rotate-90" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={() => setTimeout(() => setIsEditDialogOpen(true), 0)}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>Toggle Status</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <WithAlert
              title="Confirm to delete the meal"
              onConfirm={() => deleteMealMutation.mutate(String(meal._id))}
              trigger={
                <Button
                  className="w-full justify-start px-2 py-1.5 h-auto text-sm font-normal text-destructive focus:text-destructive focus:bg-destructive/10"
                  variant={"ghost"}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
            >
              <div className="text-muted-foreground">
                <p>Are you sure you want to delete the meal?</p>
                <p className="font-semibold text-foreground my-1">
                  {meal.name}{" "}
                </p>
                <p> This action cannot be undone.</p>
              </div>
            </WithAlert>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default MealCard;
