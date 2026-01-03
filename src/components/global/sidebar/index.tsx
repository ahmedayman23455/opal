"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Command,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  Home,
  Library,
  Map,
  PieChart,
  Plus,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/global/sidebar/nav-main";
import { NavProjects } from "@/components/global/sidebar/nav-projects";
import { NavUser } from "@/components/global/sidebar/nav-user";
import { WorkspaceSwitcher } from "@/components/global/sidebar/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaces } from "@/actions/workspace";
import { IWorkspacesProps, IWorkspaceType } from "@/types/index.type";
import Modal from "../modal";
import Search from "../search";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  workspaces: [
    {
      name: "Workspace 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Workspace 2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Workspace 3",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Library",
      url: "#",
      icon: Library,
    },
    {
      title: "Notifications",
      url: "#",
      icon: Bell,
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

type props = {
  activeWorkspaceId: string;
};

export function DashboardSidebar({ activeWorkspaceId }: props) {
  const router = useRouter();

  // Using React Query hook to fetch workspaces
  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkspaces);

  // Extract and flatten workspaces from the React Query response
  const allWorkspaces = React.useMemo(() => {
    if (!data) return [];

    const response = data as IWorkspacesProps;

    if (!response.data?.workspaces) return [];

    const flattenedWorkspaces: IWorkspaceType[] = [];

    response.data.workspaces.forEach((userWorkspace) => {
      // Add user's owned workspaces
      if (userWorkspace.workspaces) {
        flattenedWorkspaces.push(...userWorkspace.workspaces);
      }

      // Add workspaces where user is a member
      if (userWorkspace.members) {
        userWorkspace.members.forEach((member) => {
          flattenedWorkspaces.push(member.workspace);
        });
      }
    });

    // Remove duplicates based on workspace id
    return flattenedWorkspaces.filter(
      (workspace, index, self) =>
        index === self.findIndex((w) => w.id === workspace.id)
    );
  }, [data]);

  const currentWorkspace = allWorkspaces.find(
    (workspace) => workspace.id === activeWorkspaceId
  );

  console.log("🚀 ~ currentWorkspace:", currentWorkspace);

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2  justify-start w-full p-2 group-data-[collapsible=icon]:px-[2px] group-data-[collapsible=icon]:py-2 ">
          <Image src="/opal-logo.svg" alt="Opal Logo" width={28} height={28} />
          <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
            Opal
          </span>
        </div>

        {isFetched && allWorkspaces.length > 0 && (
          <WorkspaceSwitcher
            workspaces={allWorkspaces}
            activeWorkspaceId={activeWorkspaceId}
            onWorkspaceChange={onChangeActiveWorkspace}
          />
        )}
      </SidebarHeader>
      <SidebarContent className="px-2 mt-2">
        {/* <NavMain items={data.navMain} /> */}
        {currentWorkspace?.type === "PUBLIC" && (
          <Modal
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Invite to workspace
              </Button>
            }
            title="Invite to workspace"
            description="Invite a user to your workspace. They will receive an email with a link to join the workspace."
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}

        <Card className="gap-2 py-4 shadow-none mt-auto mb-4 group-data-[collapsible=icon]:hidden">
          <CardHeader className="px-4">
            <CardTitle className="text-sm">Upgrade to pro</CardTitle>
            <CardDescription>
              Get access to all features and tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <form>
              <div className="grid gap-2.5">
                <Button className="" size="sm">
                  Upgrade to pro
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
