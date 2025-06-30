import Loader from "@/components/ui/Loader";
import { IUser } from "@/models/user.model";
import Image from "next/image";
import React from "react";

function Profile({ user }: { user: IUser | null }) {

  if(!user){
    return <Loader/>
  }
  return (
    <div>
      <div className="w-full bg-red-200 h-[200px] flex justify-center">
        <div className="profile-img">
          <Image
            alt="profile"
            src={"/profileAvatar.png"}
            width={100}
            height={100}
          />
        </div>
        <div>
          <div> data :{user?.fullName}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
