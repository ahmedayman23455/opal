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
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/global/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

type Props = {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
};

const Layout = async ({ params, children }: Props) => {
  const { workspaceId } = await params;

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
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <SidebarProvider>
          <DashboardSidebar activeWorkspaceId={workspaceId} />

          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;

/* 
  NOTE : 
   We are just going to cash responses using the react query library and you can it according to 
   what you want to cache and what you don't want to cache.

   the layout pages are cached by default. it is the behavior of next js under the hood and
    what that means the layout is going to be reused anyways. 
*/
