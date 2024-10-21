import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-fit bg-gray-50">
      <h1 className={`text-7xl font-bold mb-8 font-gau-pop-magic text-red-500`}>Keiko!</h1>
      <div className="flex flex-col items-center space-y-4 w-50 max-w-xs">
        <Link href="/dashboard" className="w-full">
          <Button
            className="w-full bg-white text-red-500 hover:bg-red-500 hover:text-white border border-red-500"
            asChild
          >
            <p className={`font-gau-pop-magic`}>⟡ Start</p>
          </Button>
        </Link>

        <Link href="/help" className="w-full">
          <Button
            className="w-full bg-red-500 text-white hover:bg-white hover:text-red-500 border border-red-500"
            asChild
          >
            <p className={`font-gau-pop-magic`}>✦ How it works</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
