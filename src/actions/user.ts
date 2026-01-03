"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// ─────────────────────────────────────────────────────────────────────────────

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401 }; // 401 unauthorized
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        workspaces: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
        studio: { create: {} },
        subscription: { create: {} },
        workspaces: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspaces: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getNotifications = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401 };
    }

    const notifications = await client.user.findMany({
      where: {
        clerkId: user.id,
      },
      select: {
        notifications: true,
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });

    if (notifications && notifications.length > 0) {
      return { status: 200, data: { notifications: notifications } };
    }

    return { status: 200, data: { notifications: null } };
  } catch (error) {
    return { status: 500 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401 };
    }

    const users = await client.user.findMany({
      where: {
        OR: [
          {
            firstName: { contains: query },
          },
          {
            lastName: { contains: query },
          },
          {
            email: { contains: query },
          },
        ],
        NOT: [
          {
            clerkId: user.id,
          },
        ],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstName: true,
        lastName: true,
        image: true,
        email: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: { users: users } };
    }
    return { status: 200, data: { users: null } };
  } catch (error) {
    return { status: 500, data: { users: null } };
  }
};
