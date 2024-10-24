"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, XCircle, Star, BookOpen, ArrowLeft, Home } from 'lucide-react';

interface QuizCategory {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  rating: number;
}

interface QuizData {
  courseName: string;
  courseCode: string;
  quizCategories: QuizCategory[];
}

// mock data
const MOCK_DATA: QuizData = {
  courseName: "Mathematics 101",
  courseCode: "MATH101",
  quizCategories: [
    {
      name: "Vectors",
      totalQuestions: 30,
      correctAnswers: 25,
      wrongAnswers: 5,
      rating: 4,
    },
    {
      name: "Matrices",
      totalQuestions: 25,
      correctAnswers: 20,
      wrongAnswers: 5,
      rating: 3,
    },
    {
      name: "Calculus",
      totalQuestions: 20,
      correctAnswers: 15,
      wrongAnswers: 5,
      rating: 2,
    },
    {
      name: "Algebra",
      totalQuestions: 28,
      correctAnswers: 22,
      wrongAnswers: 6,
      rating: 4,
    },
    {
      name: "Geometry",
      totalQuestions: 25,
      correctAnswers: 20,
      wrongAnswers: 5,
      rating: 3,
    },
    {
      name: "Trigonometry",
      totalQuestions: 22,
      correctAnswers: 18,
      wrongAnswers: 4,
      rating: 4,
    },
  ],
};

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const courseData = MOCK_DATA;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-red-500 text-red-500' : 'text-zinc-300'}`}
      />
    ));
  };

  const findStrengthsAndWeaknesses = () => {
    if (!courseData?.quizCategories) return null;

    const categories = courseData.quizCategories;
    const sorted = [...categories].sort((a, b) =>
      (b.correctAnswers / b.totalQuestions) - (a.correctAnswers / a.totalQuestions)
    );

    return {
      strongest: sorted[0].name,
      weakest: sorted[sorted.length - 1].name,
    };
  };

  const analysis = findStrengthsAndWeaknesses();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col"> 
      <div className="flex justify-end gap-2 mt-4">
        <div className="p-8 max-w-6xl mx-auto flex-grow">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold font-gau-pop-magic text-red-500 ml-4">REPORTS</h1>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => (window.location.href = '/')}
                className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                aria-label="Go to home"
              >
                <Home className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course info */}
            <div className="space-y-6">
              <Card className="border bg-white">
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
                      <span className="font-semibold text-zinc-500">{courseData.courseCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-500">Course Name:</span>
                      <span className="font-semibold text-zinc-400">{courseData.courseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-500">Quiz Category:</span>
                      <span className="font-semibold text-zinc-400">
                        {selectedCategory?.name || 'None selected'}
                      </span>
                    </div>
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
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quiz Categories or Summary */}
            <div className="relative">
              {!selectedCategory ? (
                <div className="space-y-2">
                  {courseData.quizCategories.map((category) => (
                    <div
                      key={category.name}
                      className="border bg-white border-red-500 rounded-lg p-4 cursor-pointer hover:bg-red-50 transition-colors"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <h3 className="font-gau-pop-magic text-zinc-500 text-lg">{category.name}</h3>
                          <div className="flex gap-1">{renderStars(category.rating)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-zinc-500">
                            <span className="font-bold">{category.correctAnswers}</span>
                            <span className="text-zinc-400">/{category.totalQuestions}</span>
                          </div>
                          <div className="text-sm text-zinc-400">
                            {((category.correctAnswers / category.totalQuestions) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
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
                          <span className="text-zinc-500">{selectedCategory.totalQuestions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-red-500" />
                          <span className="font-bold text-zinc-500">Correct Answers:</span>
                          <span className="text-zinc-500">{selectedCategory.correctAnswers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-bold text-zinc-500">Incorrect:</span>
                          <span className="text-zinc-500">{selectedCategory.wrongAnswers}</span>
                        </div>
                        <hr className="my-5 border border-zinc-500" />
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-gau-pop-magic text-zinc-500">MASTERY:</span>
                          <div className="flex gap-1">{renderStars(selectedCategory.rating)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 p-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Back to Quizzes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
