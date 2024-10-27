"use client";

import { cn } from "@/lib/utils";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookCheck,
  ChevronsLeft,
  CircleX,
  ClipboardList,
  Clock,
  Edit,
  FileChartLine,
  FolderClock,
  Home,
  Menu,
  Pen,
  Plus,
  Search,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CourseDetails, CourseList, DashboardSidebar, QuizDetails, QuizList } from "./components";
import { LoadingSkeleton } from "@/components/status";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function MainPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const activeView = searchParams.get("view") || "";
  const selectedCourse = searchParams.get("course") || "";
  const selectedQuiz = searchParams.get("quiz") || "";
  const searchQuery = decodeURI(searchParams.get("q") || "");
  const [collapsed, setCollapsed] = useState(false);

  const {
    data: courses,
    isPending: isCoursePending,
    isFetching: isCourseFetching,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    initialData: [],
  });

  const {
    data: quizzes,
    isPending: isQuizPending,
    isFetching: isQuizFetching,
    isLoading: isQuizLoading,
    isError: isQuizError,
    error: quizError,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  function updateSearch(query: string) {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("q", encodeURI(query));
    } else {
      params.delete("q");
    }

    router.push(`?${params.toString()}`);
  }

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

  if (isCourseLoading || isCoursePending || isCourseFetching || isQuizLoading || isQuizPending || isQuizFetching) {
    return <LoadingSkeleton />;
  }

  if (isCourseError || isQuizError) {
    toast({ description: isCourseError ? courseError.message : isQuizError ? quizError.message : "" });

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {isCourseError ? courseError.message : isQuizError ? quizError.message : ""}
      </div>
    );
  }

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

  const filteredCourses = filterCourses(courses, searchQuery);

  const filteredOngoing = filterQuizzes(
    quizzes.filter((quiz: QuizData) => !quiz.is_completed),
    searchQuery,
  );

  const filteredCompleted = filterQuizzes(
    quizzes.filter((quiz: QuizData) => quiz.is_completed),
    searchQuery,
  );

  return (
    <SidebarProvider>
      <SidebarTrigger />
      <div className="fixed inset-0 flex bg-gray-100 text-extrabold overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content */}
        <main className="flex-1 p-8 overflow-hidden transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              {" "}
              {/* Changed from w-1/2 to flex-1 */}
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-400 font-semibold font-sans" />
              <Input
                type="text"
                placeholder={activeView === "courses" ? "search for courses..." : "search for quizzes..."}
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
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
          {activeView === "courses" ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 font-gau-pop-magic text-red-500">COURSES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <CourseList courses={filteredCourses} activeView={activeView} course_code={selectedCourse} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <CourseDetails courses={filteredCourses} course_code={selectedCourse} />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="space-x-2">
                  <Button
                    className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => router.push(`/reports?course=${encodeURI(selectedCourse)}`)}
                  >
                    <FileChartLine className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                </div>
                <Link href="/courses">
                  <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Courses
                  </Button>
                </Link>
              </div>
            </div>
          ) : activeView === "ongoing" ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">ON-GOING QUIZZES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizList quizzes={filteredOngoing} activeView={activeView} quizId={selectedQuiz} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizDetails quizzes={filteredOngoing} quizId={selectedQuiz} />
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <Link href={`/quiz/${selectedQuiz}`}>
                  <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                    <Pen width="20" height="20" />
                    <span>Start Quiz</span>
                  </Button>
                </Link>

                <Link href={`/review/${selectedQuiz}`}>
                  <Button className="bg-white text-red-500 border-red-500 border hover:bg-red-500 hover:text-white flex items-center space-x-2">
                    <BookOpen width="20" height="20" />
                    <span>Start Review</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : activeView === "completed" ? (
            <div>
              <h2 className="text-xl font-bold mb-4 font-gau-pop-magic text-red-500">COMPLETED QUIZZES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizList quizzes={filteredCompleted} activeView={activeView} quizId={selectedQuiz} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
                  <QuizDetails quizzes={filteredCompleted} quizId={selectedQuiz} />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                        <FolderClock className="mr-2 h-4 w-4" />
                        Mark as On-going
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-gau-pop-magic text-red-500">
                          CHANGE QUIZ STATUS
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to change the status of this quiz to ongoing?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => markCompletionMutation({ quiz_id: selectedQuiz, is_completed: false })}
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
          ) : (
            <></>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
