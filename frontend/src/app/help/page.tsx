import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { lorem } from "@/lib/flashcard-api";

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-6 italic text-red-500">Keiko!</h1>

      <Card className="mb-6 border border-red-500 rounded-lg">
        <CardHeader>
          <CardTitle className="text-1.5xl font-extrabold italic text-red-500">" "</CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-500 p-4">{lorem.generateParagraphs(2)}</CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border border-red-500 rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-zinc-500">Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4">
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>

        <Card className="border border-red-500 rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-zinc-500">Hint System</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4">
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="bg-red-500 text-white hover:bg-zinc-500 hover:text-white">
          <a href="/">Back</a>
        </Button>
      </div>
    </div>
  );
}
