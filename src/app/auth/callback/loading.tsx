import Loader from "@/components/global/loader";
import React from "react";

type Props = {};

const AuthLoading = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader state={true} />
    </div>
  );
};

export default AuthLoading;
