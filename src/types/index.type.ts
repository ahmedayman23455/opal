export interface IWorkspacesProps {
  status: number;
  data: {
    workspaces:
      | {
          subscription: {
            plan: "FREE" | "PRO";
          } | null;
          workspaces: {
            id: string;
            name: string;
            type: "PERSONAL" | "PUBLIC";
          }[];
          members: {
            workspace: {
              id: string;
              name: string;
              type: "PERSONAL" | "PUBLIC";
            };
          }[];
        }[]
      | null;
  };
}

export interface IWorkspaceType {
  id: string;
  name: string;
  type: "PERSONAL" | "PUBLIC";
}
