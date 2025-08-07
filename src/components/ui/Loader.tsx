import { Loader2 } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <div className=" w-full h-full flex justify-center items-center mx-auto">
      <Loader2 className="h-12 w-12 animate-spin duration-100"></Loader2>
    </div>
  );
}

export default Loader;
