import { getNotifications, onAuthenticateUser } from "@/actions/user";
import {
  getAllUserVideos,
  getWorkspaceFolders,
  getWorkspaces,
  verifyAccessToWorkspace,
} from "@/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";
import {
  dehydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspaces[0].id}`);
  }

  if (!hasAccess.data?.workspace) {
    return null;
  }

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkspaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  /* 
    NOTE :
    we don't need to store data and pass them to prop or anything. 
    that's the benefit of react query. we can cache all the data and use it whenever we want.  it like 
    state management but for server component   
  */
  return <div>layout</div>;
};

export default Layout;

/* 
  NOTE : 
   We are just going to cash responses using the react query library and you can it according to 
   what you want to cache and what you don't want to cache.

   the layout pages are cached by default. it is the behavior of next js under the hood and
    what that means the layout is going to be reused anyways. 
*/
