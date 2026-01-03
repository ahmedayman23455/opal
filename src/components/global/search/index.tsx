import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import React from "react";
import { Input } from "../../ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  workspaceId: string;
};

const Search = (props: Props) => {
  const { query, onSearchQuery, isFetching, onUsers } = useSearch(
    "get-users",
    "USERS"
  );

  //todo: Sending Invitation
  //todo: Invite button
  // const { mutate, isPending } = useMutationData(
  //   ["invite-member"],
  //   (data: { recieverId: string; email: string }) => {
  //     return inviteMember(data);
  //   }
  // );

  return (
    <div className="flex flex-col gap-4">
      <Input
        onChange={onSearchQuery}
        value={query}
        placeholder="Search for a user"
        type="text"
      />

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm"> No users found </p>
      ) : (
        <div>
          {onUsers.map((user) => (
            <div
              key={user.id}
              className="flex gap-x-3 items-center border-2 w-full p-3 rounded-lg"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start">
                <h3 className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="lowercase text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <div className="flex-1 flex justify-end">
                <Button variant="outline" size="sm">
                  <UserPlus className="size-4" />
                  Invite
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
