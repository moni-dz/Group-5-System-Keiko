import { Button } from "@/components/ui/button";

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
          <div className="space-y-4">
              <div className="flex gap-5">
                  <Button className="w-64" asChild>
                      <a href="/manage">Manage Cards</a>
                  </Button>
                  <Button className="w-64" variant="outline" asChild>
                      <a href="/review">Review Cards</a>
                  </Button>
              </div>
          </div>
      </div>
  );
}
