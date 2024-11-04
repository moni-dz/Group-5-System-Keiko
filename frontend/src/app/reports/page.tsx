"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, XCircle, Star, BookOpen, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllQuizzes, getCourseByCode, QuizData, ratingFor } from "@/lib/api";
import { ErrorSkeleton, LoadingSkeleton } from "@/components/status";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";

// Import the logo
import logo from "@/public/logo.png";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const course_code = decodeURI(searchParams.get("course") || "");
  const [selectedCategory, setSelectedCategory] = useState<QuizData | null>(null);

  const {
    data: course,
    isPending: isCoursePending,
    isError: isCourseError,
    error: courseError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourseByCode(course_code),
  });

  const {
    data: quizzes,
    isPending: isQuizzesPending,
    isError: isQuizzesError,
    error: quizzesError,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  const courseQuizzes = quizzes.filter((q) => q.course_code == course_code);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
      ));
  };

  function findStrengthsAndWeaknesses() {
    if (courseQuizzes.length == 0) return null;

    const sorted = courseQuizzes.sort((a, b) => b.correct_count / b.card_count - a.correct_count / a.card_count);

    return {
      strongest: sorted[0].category,
      weakest: sorted[sorted.length - 1].category,
    };
  }

  const analysis = findStrengthsAndWeaknesses();

  if (isCourseError || isQuizzesError)
    return <ErrorSkeleton error={isCourseError ? courseError : isQuizzesError ? quizzesError : undefined} />;

  if (isCoursePending || isQuizzesPending) return <LoadingSkeleton />;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="p-8 max-w-6xl mx-auto flex-grow">
        <div className="flex justify-betwe  en items-start">
          <div className="flex items-center">
            {/* Add logo here */}
            <img src={logo.src} alt="Logo" className="h-10 mr-4" />
            <h1 className="text-3xl font-bold font-gau-pop-magic text-red-500">REPORTS</h1>
          </div>
          <div className="absolute top-4 right-4">
            <Link href="/dashboard?view=courses">
              <Button className="p-2 rounded-full bg-inherit shadow-none hover:bg-red-50 text-red-500 transition-colors">
                <Home className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course info */}
          <div className="space-y-6">
            <Card className="border bg-white mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-gau-pop-magic text-zinc-500">
                  <BookOpen className="w-6 h-6" />
                  COURSE INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-500">Course Code:</span>
                    <span className="font-semibold text-zinc-500">{course.course_code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-500">Course Name:</span>
                    <span className="font-semibold text-zinc-400">{course.name}</span>
                  </div>
                  {selectedCategory?.category && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-500">Quiz Category:</span>
                      <span className="font-semibold text-zinc-400">{selectedCategory.category}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Analysis Card */}
            {analysis && (
              <Card className="border bg-white">
                <CardHeader>
                  <CardTitle className="font-gau-pop-magic text-zinc-500">PERFORMANCE REPORT</CardTitle>
                </CardHeader>
                <CardContent>
                  {courseQuizzes.length > 1 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-500">Your Strongest Topic:</span>
                        <span className="font-semibold text-red-400">{analysis.strongest}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-500">Needs Improvement:</span>
                        <span className="font-semibold text-red-400">{analysis.weakest}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-center text-zinc-400">
                      Add more quizzes to get your report.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          {/* Quiz Categories or Summary */}
          <div className="relative">
            {!selectedCategory ? (
              <div className="space-y-2 mt-4">
                {courseQuizzes.map((quiz) => (
                  <div
                    key={quiz.category}
                    className="border bg-white border-red-500 rounded-lg p-4 cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => setSelectedCategory(quiz)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-gau-pop-magic text-zinc-500 text-lg">{quiz.category}</h3>
                        <div className="flex gap-1">{renderStars(ratingFor(quiz))}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-zinc-500 mb-1">
                          <span className="font-bold">{quiz.correct_count}</span>
                          <span className="text-zinc-400">/{quiz.card_count}</span>
                        </div>
                        <div className="text-sm text-zinc-400">
                          {((quiz.correct_count / quiz.card_count) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <Card className="border border-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-gau-pop-magic text-zinc-500">
                      QUIZ SUMMARY
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-zinc-500">Total Questions:</span>
                        <span className="text-zinc-500">{selectedCategory.card_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-zinc-500">Correct Answers:</span>
                        <span className="text-zinc-500">{selectedCategory.correct_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-zinc-500">Incorrect:</span>
                        <span className="text-zinc-500">
                          {selectedCategory.card_count - selectedCategory.correct_count}
                        </span>
                      </div>
                      <hr className="my-5 border border-zinc-500" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-gau-pop-magic text-zinc-500">MASTERY:</span>
                        <div className="flex gap-1">{renderStars(ratingFor(selectedCategory))}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 p-2 bg-white text-red-500 font-gau-pop-magic border rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  BACK TO QUIZZES
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
