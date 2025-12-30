"use server";

import { client } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// ─── VerifyAccessToWorkspace ─────────────────────────────────────────────────

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
    return { status: 500, data: { workspace: null } }; // 500 internal server error
  }
}


// ─── Getworkspacefolders ─────────────────────────────────────────────────────

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
        }
      }
    });

    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: { folders: isFolders } };
    }
    return { status: 200, data: { folders: null } };
  }

  catch (error) {
    return { status: 500, data: { folders: null } }; // 500 internal server error
  }
}



// ─── Getalluservideos ────────────────────────────────────────────────────────
export const getAllUserVideos = async (workspaceId: string) => {
  try {
    const videos = await client.video.findMany({
      where: {
        OR: [{ workspaceId }, {
          folderId: workspaceId
        }
        ]
      },
      select : { 
        id: true ,  
        title: true, 
        createdAt: true, 
        source: true ,  
        processing: true ,    
        
      }
    });
  }

  catch (error) {
    return { status: 500, data: { videos: null } }; // 500 internal server error
  }
}