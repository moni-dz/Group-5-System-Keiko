import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, XCircle, Star, BookOpen } from 'lucide-react';

interface PageProps {
  params: {
    course_code: string;
  };
}

async function getData(courseCode: string) {
  // info sa course and quizzes here emz
  // mock data
  return {
    courseName: "",
    courseCode: courseCode,
    totalQuestions: 30,
    correctAnswers: 25,
    wrongAnswers: 5,
    rating: 4
  };
}

export default async function Page({ params }: PageProps) {
  const { course_code } = await params;

  const quizInfo = await getData(course_code);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`}
      />
    ));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 font-gau-pop-magic text-red-500">REPORTS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* course info */}
        <div className="relative pt-6">
        { /* <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-600"> */}
         {/*Quiz Information*/}
          <Card className="border border-red-500">
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
                  <span className="font-semibold text-zinc-500">{quizInfo.courseCode}</span>

                </div>
                <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-500">Course Name: </span>
                <span className="font-semibold text-zinc-400">{quizInfo.courseName}                </span>
                </div>
                <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-500">Quiz Category:</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* reports */}
        <div className="relative pt-6">
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
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-zinc-500">Correct Answers:</span> 
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-zinc-500">Incorrect:</span> 
                </div>
                <hr className="my-5 border border-zinc-500" />
                <div className="flex items-center gap-2">
                  <span className="font-bold font-gau-pop-magic text-zinc-500">MASTERY:</span>
                  <div className="flex gap-1 ">
                    {renderStars(quizInfo.rating)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}