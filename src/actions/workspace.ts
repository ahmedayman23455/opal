"use server";

import { client } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// ─────────────────────────────────────────────────────────────────────────────

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
    return { status: 500, data: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getWorkspaceFolders = async (workspaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: { folders: isFolders } };
    }
    return { status: 200, data: { folders: null } };
  } catch (error) {
    return { status: 500, data: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getAllUserVideos = async (workspaceId: string) => {
  try {
    const videos = await client.video.findMany({
      where: {
        OR: [
          { workspaceId },
          {
            folderId: workspaceId,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length > 0) {
      return { status: 200, data: { videos: videos } };
    }
    return { status: 200, data: { videos: null } };
  } catch (error) {
    return { status: 500, data: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { stauts: 403 };
    }

    const workspaces = await client.user.findMany({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspaces: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces && workspaces.length > 0) {
      return { status: 200, data: { workspaces: workspaces } };
    }
    return { status: 200, data: { workspaces: null } };
  } catch (error) {
    return { status: 500, data: null };
  }
};
