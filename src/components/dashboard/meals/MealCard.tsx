"use client"
import { IMeal } from "@/models/meal.model";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
function MealCard({
  meal,
  listOnly = false,
}: {
  meal: IMeal;
  listOnly?: boolean;
}) {
  const {userRole} = useCurrentUser();
  return (
    <Link href={`/dashboard/meals/${meal._id}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            {meal.name} - {meal.type}
          </CardTitle>
          <CardAction>
            {
              userRole===UserRole.admin && <MealActionMenu />
            }
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
    </Link>
  );
}



function MealActionMenu() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Ellipsis className="rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-20">
        {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel> */}

        <DropdownMenuItem>
          Edit
          <EditIcon />
        </DropdownMenuItem>
        <DropdownMenuItem>Toggle Status</DropdownMenuItem>
        <DropdownMenuItem>
          <WithAlert title="Confirm to delete the meal" trigger={<Button variant={"destructive"}>Delete<Trash2/></Button>}>
          <> </>
          </WithAlert>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default MealCard;
