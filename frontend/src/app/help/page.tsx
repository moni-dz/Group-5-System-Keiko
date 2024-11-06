import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Image src={logo.src} alt="Logo" className="h-14 mr-4" width={60} height={60} />
      </div>

      <Card className="mb-6 border-2 border-red-500 rounded-lg overflow-hidden">
        <CardContent className="text-zinc-500 p-4 break-words">
          <span className="font-extrabold text-red-500 font-gau-pop-magic">Keiko!</span> is your personalized flashcard
          system designed to improve your learning journey. Tailor your dashboard with custom courses and create a study
          flow that fits your style! With smart analytics, discover your strengths and areas for improvement, while helpful hints guide you through
          quizzes for better recall and understanding.
          <br />
          <br />
          <span className="font-extrabold text-red-500 font-gau-pop-magic">Keiko!</span> empowers you to study
          effectively and master subjects on your own terms, at your own pace!
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-2 border-red-500 rounded-lg">
          <CardHeader className="border-b border-red-500 pb-2">
            <CardTitle className="text-2xl font-extrabold text-red-500 font-gau-pop-magic ">ANALYTICS</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4 text-justify">
            <ul className="list-disc list-inside">
              <li>In-depth view of quiz performance to track progress</li>
              <li>Mastery score provided to gauge overall proficiency</li>
              <li>Detailed comparison across all quizzes within a course</li>
              <li>Easy identification of areas that may need additional focus</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-500 rounded-lg">
          <CardHeader className="border-b border-red-500 pb-2">
            <CardTitle className="text-2xl font-extrabold text-red-500 font-gau-pop-magic ">HINT SYSTEM</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4 text-justify">
            <ul className="list-disc list-inside">
              <li>Hint option is available when needed!</li>
              <li>Removes one incorrect choice to narrow down options</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-red-500 text-white hover:bg-zinc-500 hover:text-white font-gau-pop-magic"
          >
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
