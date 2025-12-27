import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen container mx-auto">
      {children}
    </div>
  );
};

export default layout;
