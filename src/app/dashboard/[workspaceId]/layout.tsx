import { onAuthenticateUser } from "@/actions/user";
import { verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { workspaceId: string };
};

const Layout = async ({ children, params: { workspaceId } }: Props) => {
  const auth = await onAuthenticateUser();

  if (!auth.user?.workspaces) {
    return redirect("/auth/sign-in");
  }

  if (!auth.user?.workspaces.length) {
    return redirect("/auth/sign-in");
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  return <div>layout</div>;
};

export default Layout;
