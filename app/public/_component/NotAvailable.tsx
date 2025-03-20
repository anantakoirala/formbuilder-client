import { Frown } from "lucide-react";
import React from "react";

type Props = {};

const NotAvailable = (props: Props) => {
  return (
    <div className="h-screen flex flex-col items-center space-y-4 justify-center">
      <div className="flex-1 ">
        <Frown size={"80px"} />
        <h1 className="text-xl font-semibold">
          This form is no longer available
        </h1>
      </div>
    </div>
  );
};

export default NotAvailable;
