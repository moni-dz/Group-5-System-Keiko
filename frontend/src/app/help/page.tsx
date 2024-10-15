import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { lorem } from "@/lib/flashcard-api";

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">How It Works</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent>{lorem.generateParagraphs(2)}</CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hint System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <a href="/">Back</a>
        </Button>
      </div>
    </div>
  );
}
