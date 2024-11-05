import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "next-view-transitions";

export default async function HelpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-6 italic text-red-500 font-gau-pop-magic">Keiko!</h1>

      <Card className="mb-6 border border-red-500 rounded-lg overflow-hidden">
        <CardContent className="text-zinc-500 p-4 break-words">
          <span className="font-extrabold text-zinc-500 font-gau-pop-magic">Keiko!</span> is your personalized flashcard
          system designed to improve your learning journey. Tailor your dashboard with custom courses and create a study
          flow that fits your style!
          <br />
          <br />
          With smart analytics, discover your strengths and areas for improvement, while helpful hints guide you through
          quizzes for better recall and understanding.
          <br />
          <br />
          <span className="font-extrabold text-zinc-500 font-gau-pop-magic">Keiko!</span> empowers you to study
          effectively and master subjects on your own terms, at your own pace!
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border border-red-500 rounded-lg">
          <CardHeader className="border-b border-red-500 pb-2">
            <CardTitle className="text-2xl font-extrabold text-red-500 font-gau-pop-magic">ANALYTICS</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4 text-justify">
            <p>
              Our course reports provide an in-depth view of your quiz performance, helping you track progress and
              identify areas for improvement. You’ll see a breakdown of correct and incorrect answers, a mastery score,
              and a detailed comparison across all quizzes within a course, making it easy to spot where additional
              focus might be useful!
            </p>
          </CardContent>
        </Card>

        <Card className="border border-red-500 rounded-lg">
          <CardHeader className="border-b border-red-500 pb-2">
            <CardTitle className="text-2xl font-extrabold text-red-500 font-gau-pop-magic">HINT SYSTEM</CardTitle>
          </CardHeader>
          <CardContent className="text-zinc-500 p-4 text-justify">
            <p>
              Our hint system is there to lend a helpful nudge when you need it most! By eliminating one of the
              incorrect choices at random, it helps narrow down the options, giving you a clearer path toward the right
              answer.
            </p>
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
