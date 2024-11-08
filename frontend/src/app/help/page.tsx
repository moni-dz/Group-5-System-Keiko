"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useState } from "react";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Image src={logo.src} alt="Logo" className="h-14 mr-4" width={60} height={60} />
        <h1 className="text-3xl font-bold text-red-500 font-gau-pop-magic">HOW IT WORKS!</h1>
      </div>

      <Card className="mb-6 border-2 border-red-500 rounded-lg overflow-hidden">
        <CardContent className="text-zinc-500 p-4 break-words">
          <span className="font-extrabold text-red-500 font-gau-pop-magic">Keiko!</span> is your personalized flashcard
          system designed to improve your learning journey. Tailor your dashboard with custom courses and create a study
          flow that fits your style! With smart analytics, discover your strengths and areas for improvement, while
          helpful hints guide you through quizzes for better recall and understanding.
          <br />
          <br />
          <span className="font-extrabold text-red-500 font-gau-pop-magic">Keiko!</span> empowers you to study
          effectively and master subjects on your own terms, at your own pace!
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div onClick={() => setShowAnalytics(!showAnalytics)} className="cursor-pointer relative">
          <div
            className={cn(
              "absolute w-full transition-opacity duration-300 ease-in-out bg-red-500 border-2 border-red-500 p-4 rounded-lg",
              showAnalytics ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <div className="absolute -top-1 -left-1">
              <div className="rounded-full border-2 border-zinc-400 bg-zinc-400 p-1 animate-[bounce_1s_infinite]">
                <Sparkle className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-gau-pop-magic text-center">ANALYTICS</h2>
          </div>

          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out bg-white border-2 border-red-500 p-4 rounded-lg",
              showAnalytics ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="text-zinc-500 font-semibold">
              <ul className="list-disc list-inside">
                <li>In-depth view of quiz performance to track progress</li>
                <li>Mastery score provided to gauge overall proficiency</li>
                <li>Detailed comparison across all quizzes within a course</li>
                <li>Easy identification of areas that may need additional focus</li>
              </ul>
            </div>
          </div>
        </div>

        <div onClick={() => setShowHints(!showHints)} className="cursor-pointer relative">
          <div
            className={cn(
              "absolute w-full transition-opacity duration-300 ease-in-out bg-red-500 border-2 border-red-500 p-4 rounded-lg",
              showHints ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <div className="absolute -top-1 -left-1">
              <div className="rounded-full border-2 border-zinc-400 bg-zinc-400 p-1 animate-[bounce_1s_infinite]">
                <Sparkle className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-gau-pop-magic text-center">HINT SYSTEM</h2>
          </div>

          <div
            className={cn(
              "transition-opacity duration-300 ease-in-out bg-white border-2 border-red-500 p-4 rounded-lg",
              showHints ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="text-zinc-500 font-semibold">
              <ul className="list-disc list-inside">
                <li>Hint option is available when needed!</li>
                <li>Removes one incorrect choice to narrow down options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-white text-red-500 hover:bg-zinc-500 border border-red-500 hover:border-zinc-500 hover:text-white font-gau-pop-magic"
          >
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
