import React from "react";
import LandingPageNavbar from "./_components/navbar";

type props = {
  children: React.ReactNode;
};

export default function Layout({ children }: props) {
  return (
    <div className="flex flex-col py-4 px-10 xl:px-8 w-full xl:container mx-auto">
      <LandingPageNavbar />
      {children}
    </div>
  );
}
