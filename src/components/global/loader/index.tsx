import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  state: boolean;
  className?: string;
  color?: string;
  children?: React.ReactNode;
};

const Loader = ({ state, className, color, children }: Props) => {
  return state ? <Spinner className={cn(className, color)} /> : children;
};

export default Loader;
