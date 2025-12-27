/*  clerk authentication is going to send us a response . and the response is 
going to  our call back url */

import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const AuthCallbackPage = async (props: Props) => {
  const auth = await onAuthenticateUser();

  console.log("🚀 ~ AuthCallbackPage ~ auth:", auth.user);

  if (auth.status === 200 || auth.status === 201) {
    // return redirect(`/dashboard/${auth.user?.firstName}${auth.user?.lastName}`);
    return redirect(`/dashboard/${auth.user?.workspaces[0].id}`);
  }

  return redirect("/auth/sign-in");
};

export default AuthCallbackPage;
