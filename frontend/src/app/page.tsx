import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-fit bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
      <div className="space-y-4">
        <div className="flex gap-5">
          <Button asChild>
            <a href="/manage">Manage Cards</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/review">Review Cards</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
