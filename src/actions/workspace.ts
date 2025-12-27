"use server";

import { client } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { stauts: 403 };
    }

    const isUserInWorkspace = await client.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            user: {
              clerkId: user.id, //workspace owner
            },
          },
          {
            members: {
              some: {
                user: {
                  clerkId: user.id, //workspace member
                },
              },
            },
          },
        ],
      },
    });

    return { status: 200, data: { workspace: isUserInWorkspace } };
  } catch (error) {
    return { status: 403, data: { workspace: null } };
  }
};
