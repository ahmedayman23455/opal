import { use, useEffect, useState } from "react";
import { useQueryData } from "./useQueryData";
import { searchUsers } from "@/actions/user";

export const useSearch = (key: string, type: "USERS") => {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [onUsers, setOnUsers] = useState<
    | {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: string | null;
        email: string | null;
        subscription: {
          plan: "FREE" | "PRO";
        } | null;
      }[]
    | null
  >(null);

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      setDebounce(query);
    }, 500);
    return () => clearTimeout(delayInputTimeout);
  }, [query]);

  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === "USERS") {
        const users = await searchUsers(queryKey[1] as string);

        if (users.status === 200) {
          setOnUsers(users.data?.users || null);
        }
      }
    },
    false
  );

  useEffect(() => {
    if (debounce) {
      refetch();
    }

    if (!debounce) {
      setOnUsers(null);
    }

    return () => {
      debounce;
    };
  }, [debounce, refetch]);

  return { onSearchQuery, query, isFetching, onUsers };
};
