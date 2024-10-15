import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { lorem } from "@/lib/flashcard-api";
import localFont from 'next/font/local';

const gauPopMagic = localFont({
  src: './GAU_pop_magic.woff2',
  display: 'swap',
});

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-4xl font-extrabold mb-6 italic underline decoration-dotted underline-offset-4 text-blue-950 ${gauPopMagic.className}`}>How It Works</h1>

      <Card className="mb-6 border border-blue-950 rounded-lg"> 
        <CardHeader>
          <CardTitle className={`text-1.5xl font-extrabold  text-blue-950`}>
            
          </CardTitle>
        </CardHeader>
        <CardContent className={`text-blue-950 font-bold`}>{"hello! keiko keiko keiko keiko keiko!! keiko!"}</CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border border-blue-950 rounded-lg"> 
          <CardHeader>
            <CardTitle className={`text-2xl text-blue-950 ${gauPopMagic.className}`}>
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>

        <Card className="border border-blue-950 rounded-lg">
          <CardHeader>
            <CardTitle className={`text-2xl text-blue-950 ${gauPopMagic.className}`}>
              Hint System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className={`bg-blue-950 text-white hover:bg-red-500 hover:text-white ${gauPopMagic.className}`} 
        >
          <a href="/">Back</a>
        </Button>
      </div>
    </div>
  );
}
