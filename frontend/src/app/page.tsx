import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-fit bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Keiko</h1>
      <div className="flex flex-col items-center space-y-4 w-50 max-w-xs">
        <Link href="/dashboard" className="w-full">
          <Button className="w-full" asChild>
            <p>Start</p>
          </Button>
        </Link>
        <Link href="/help" className="w-full">
          <Button className="w-full" variant="outline" asChild>
            <p>How it works</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
