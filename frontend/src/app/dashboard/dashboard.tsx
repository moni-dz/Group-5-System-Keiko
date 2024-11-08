"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CourseData, QuizData, getAllCourses, getAllQuizzes, setQuizCompletion } from "@/lib/api";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Edit, FileChartLine, FolderClock, Home, Pen, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useCallback, CSSProperties, MouseEvent } from "react";
import { CourseDetails, CourseList, DashboardSidebar, QuizDetails, QuizList } from "./components";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeView, setActiveView] = useQueryState("view");
  const [searchTerm, setSearchTerm] = useQueryState("q");
  const [selectedCourse, setSelectedCourse] = useQueryState("course");
  const [selectedQuiz, setSelectedQuiz] = useQueryState("quiz");
  const [collapsed, setCollapsed] = useState(false);

  const disabledCourseStyle = useMemo<CSSProperties>(
    () => (selectedCourse === null ? { pointerEvents: "none" } : {}),
    [selectedCourse],
  );

  const disableCourseOnClick = useCallback(
    (event: MouseEvent) => {
      if (selectedCourse === null) {
        event.preventDefault();
        return false;
      }
    },
    [selectedCourse],
  );

  const disabledQuizStyle = useMemo<CSSProperties>(
    () => (selectedQuiz === null ? { pointerEvents: "none" } : {}),
    [selectedQuiz],
  );

  const disabledQuizOnClick = useCallback(
    (event: MouseEvent) => {
      if (selectedQuiz === null) {
        event.preventDefault();
        return false;
      }
    },
    [selectedQuiz],
  );

  const { data: courses } = useSuspenseQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const { data: quizzes } = useSuspenseQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
  });

  const markCompletionMutation = useMutation({
    mutationFn: (props: { quiz_id: string; is_completed: boolean }) =>
      setQuizCompletion(props.quiz_id, props.is_completed),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });
    },
    onError: (e) => toast({ description: e.message }),
  }).mutate;

  function filterCourses(courses: CourseData[], query: string) {
    if (!courses) return [];

    return courses.filter(
      (course) =>
        course.course_code.toLowerCase().includes(query.toLowerCase()) ||
        course.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  function filterQuizzes(quizzes: QuizData[], query: string) {
    return quizzes.filter(
      (quiz) =>
        quiz.course_code.toLowerCase().includes(query.toLowerCase()) ||
        quiz.category.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const filteredCourses = filterCourses(courses, searchTerm ?? "");

  const filteredOngoing = filterQuizzes(
    quizzes.filter((quiz: QuizData) => !quiz.is_completed),
    searchTerm ?? "",
  );

  const filteredCompleted = filterQuizzes(
    quizzes.filter((quiz: QuizData) => quiz.is_completed),
    searchTerm ?? "",
  );

  return (
    <SidebarProvider>
      <SidebarTrigger />
      <div className="fixed inset-0 flex bg-gray-100 text-extrabold overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* Main content */}
        <main className={cn("flex-1 p-8 overflow-hidden transition-all duration-300 ease-in-out")}>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              {" "}
              {/* Changed from w-1/2 to flex-1 */}
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-400 font-semibold font-sans" />
              <Input
                type="text"
                placeholder={activeView === "courses" ? "✦ search for a course..." : "✦ search for a quiz..."}
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm ?? ""}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link href="/">
              <Button
                className="p-2 rounded-full bg-inherit shadow-none hover:bg-red-50 text-red-500 transition-colors"
                aria-label="Go to home"
              >
                <Home className="w-6 h-6" />
              </Button>
            </Link>
          </div>

          {activeView === "courses" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 font-gau-pop-magic text-red-500">COURSES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <CourseList
                    courses={filteredCourses}
                    selectedCourse={selectedCourse ?? ""}
                    setSelectedCourse={setSelectedCourse}
                  />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <CourseDetails courses={filteredCourses} course_code={selectedCourse ?? ""} />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="space-x-2">
                  <Link
                    prefetch={selectedCourse !== null}
                    href={`/reports/${encodeURI(selectedCourse!)}`}
                    style={disabledCourseStyle}
                    onClick={disableCourseOnClick}
                  >
                    <Button
                      className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                      disabled={selectedCourse === null}
                    >
                      <FileChartLine className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                  </Link>
                </div>
                <Link prefetch href="/courses">
                  <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Courses
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeView === "ongoing" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">ON-GOING QUIZZES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizList
                    quizzes={filteredOngoing}
                    selectedQuiz={selectedQuiz ?? ""}
                    setSelectedQuiz={setSelectedQuiz}
                  />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizDetails quizzes={filteredOngoing} quizId={selectedQuiz ?? ""} />
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <Link
                  prefetch={selectedQuiz !== null}
                  href={`/quiz/${selectedQuiz}`}
                  style={disabledQuizStyle}
                  onClick={disabledQuizOnClick}
                >
                  <Button
                    className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2"
                    disabled={selectedQuiz === null}
                  >
                    <Pen width="20" height="20" />
                    <span>Start Quiz</span>
                  </Button>
                </Link>

                <Link
                  prefetch={selectedQuiz !== null}
                  href={`/review/${selectedQuiz}`}
                  style={disabledQuizStyle}
                  onClick={disabledQuizOnClick}
                >
                  <Button
                    className="bg-white text-red-500 border-red-500 border hover:border-zinc-500 hover:bg-zinc-500 hover:text-white flex items-center space-x-2"
                    disabled={selectedQuiz === null}
                  >
                    <BookOpen width="20" height="20" />
                    <span>Start Review</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {activeView === "completed" && (
            <div>
              <h2 className="text-xl font-bold mb-4 font-gau-pop-magic text-red-500">COMPLETED QUIZZES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizList
                    quizzes={filteredCompleted}
                    selectedQuiz={selectedQuiz ?? ""}
                    setSelectedQuiz={setSelectedQuiz}
                  />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizDetails quizzes={filteredCompleted} quizId={selectedQuiz ?? ""} />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="space-x-2 relative">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                        disabled={selectedQuiz === null}
                      >
                        <FolderClock className="mr-2 h-4 w-4" />
                        Mark as On-going
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="ping-container">
                          <div className="ping"></div>
                          <AlertDialogTitle className="font-gau-pop-magic text-red-500">
                            CHANGE QUIZ STATUS
                          </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                          Are you sure you want to change the status of this quiz to ongoing?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-red-500 hover:bg-red-500 hover:text-white border border-red-500">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (quizzes.find((q) => q.id === selectedQuiz)?.is_completed) {
                              markCompletionMutation({ quiz_id: selectedQuiz ?? "", is_completed: false });
                            }
                          }}
                          className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
