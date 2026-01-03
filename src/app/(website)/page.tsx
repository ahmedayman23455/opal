import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div>
      <main className="max-w-3xl mx-auto py-20">
        {/* Hero Section */}
        <div className="flex flex-col gap-6 text-center justify-center items-center">
          <h2 className="text-4xl font-bold">
            Effortless Video Messaging for Teams
          </h2>

          <p className="text-zinc-300 font-normal">
            Instantly record, share, and collaborate with async video messages.
            Unlock productivity—skip the long meetings, get to the point, and
            let your ideas shine.{" "}
            <span className="font-semibold text-[#55d086]">
              Just like Loom, but opal-smooth.
            </span>
          </p>

          <div className="flex items-center gap-4">
            <Button className="cursor-pointer w-max">Get Started Free</Button>
            <Button variant="outline" className="cursor-pointer w-max">
              Watch Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
