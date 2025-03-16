import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return <div className="w-full h-auto">{children}</div>;
};

export default layout;
