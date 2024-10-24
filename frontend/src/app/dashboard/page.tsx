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
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import logo from "../../public/logo.png";
import { CourseDetails, CourseList, QuizDetails, QuizList } from "./components";
import Loading from "./loading";

export default function MainPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const activeView = searchParams.get("view") || "";
  const selectedCourse = searchParams.get("course") || "";
  const selectedQuiz = searchParams.get("quiz") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const courseQuery = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const quizQuery = useQuery({
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

  if (courseQuery.isPending || quizQuery.isPending) {
    return <Loading />;
  }

  if (courseQuery.isError || quizQuery.isError) {
    if (courseQuery.isError) {
      toast({ description: courseQuery.error.message });
    } else if (quizQuery.isError) {
      toast({ description: quizQuery.error.message });
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {courseQuery.isError ? courseQuery.error.message : quizQuery.isError ? quizQuery.error.message : ""}
      </div>
    );
  }

  function filterCourses(courses: CourseData[], query: string) {
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

  const filteredCourses = filterCourses(courseQuery.data, searchQuery);

  const filteredOngoing = filterQuizzes(
    quizQuery.data.filter((quiz: QuizData) => !quiz.is_completed),
    searchQuery,
  );

  const filteredCompleted = filterQuizzes(
    quizQuery.data.filter((quiz: QuizData) => quiz.is_completed),
    searchQuery,
  );

  function markQuizAsOngoing(selected_id: string) {
    const quiz = filteredCompleted.find((quiz) => quiz.id === selectedQuiz);

    if (quiz) {
      markCompletionMutation({ quiz_id: quiz.id, is_completed: false });

      filteredCompleted.splice(
        filteredCompleted.findIndex((quiz: QuizData): boolean => quiz.id === selected_id),
        1,
      );
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className={`flex h-screen bg-gray-100 text-extrabold`}>
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? "w-16 bg-white text-zinc-500" : "w-64 bg-white shadow-md"
          }`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-center items-center mb-6">
                {isSidebarCollapsed ? (
                  <Image src={logo} alt="logo" />
                ) : (
                  <h1 className={`text-3xl font-bold font-gau-pop-magic text-red-500 text-center`}>Keiko!</h1>
                )}
              </div>

              <nav className="flex flex-col">
                <Link href="?view=courses">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${
                      isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""
                    } justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                  >
                    {isSidebarCollapsed ? (
                      <ClipboardList />
                    ) : (
                      <>
                        <ClipboardList className="mr-2" />
                        Courses
                      </>
                    )}
                  </Button>
                </Link>

                <Link href="?view=ongoing">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${
                      isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""
                    } justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                  >
                    {isSidebarCollapsed ? (
                      <Clock />
                    ) : (
                      <>
                        <Clock className="mr-2" />
                        On-Going
                      </>
                    )}
                  </Button>
                </Link>

                <Link href="?view=completed">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${
                      isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""
                    } justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                  >
                    {isSidebarCollapsed ? (
                      <BookCheck />
                    ) : (
                      <>
                        <BookCheck className="mr-2" />
                        Completed
                      </>
                    )}
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex justify-center items-center mt-auto">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {isSidebarCollapsed ? (
                  <Menu className="text-zinc-500" />
                ) : (
                  <div className="flex items-center">
                    <ChevronsLeft className="text-red-500" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-1/2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-400 text-semibold font-sans" />
              <Input
                type="text"
                placeholder={activeView === "courses" ? "search for courses..." : "search for quizzes..."}
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link href="/">
              <Button variant="ghost" className="p-2">
                <Home className="h-5 w-5 text-red-500 bg-gray-100 hover:text-white hover:bg-red-500 rounded-sm" />
              </Button>
            </Link>
          </div>

          {activeView === "courses" ? (
            <div>
              <h2 className={`text-2xl font-bold mb-4 font-gau-pop-magic text-red-500`}>COURSES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                  <CourseList courses={filteredCourses} activeView={activeView} course_code={selectedCourse} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <CourseDetails courses={filteredCourses} course_code={selectedCourse} />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="space-x-2">
                  <Link href="/courses">
                    <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                      <Plus className="mr-2 h-4 w-4 hover:text-white" />
                      Add
                    </Button>
                  </Link>
                  <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                    <CircleX className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ) : activeView === "ongoing" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">ON-GOING QUIZZES</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <QuizList quizzes={filteredOngoing} activeView={activeView} quizId={selectedQuiz} />
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <QuizDetails quizzes={filteredOngoing} quizId={selectedQuiz} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex space-x-4">
                {/* Start Quiz button */}
                <Link href={`/quiz/${selectedQuiz}`}>
                  <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                    <Pen width="20" height="20" />
                    <span>Start Quiz</span>
                  </Button>
                </Link>

                {/* Start Review button */}
                <Link href={`/review/${selectedCourse}`}>
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
                <div className="bg-white shadow-md rounded-lg p-4">
                  <QuizList quizzes={filteredCompleted} activeView={activeView} quizId={selectedQuiz} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
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
                          {" "}
                          CHANGE QUIZ STATUS{" "}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this quiz as ongoing? This will reset the course progress!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" hover:bg-red-500 hover:text-white border border-red-500 text-red-500">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="hover:bg-red-500 hover:text-white border border-red-500 text-red-500 bg-white"
                          onClick={() => markCompletionMutation({ quiz_id: selectedQuiz, is_completed: false })}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                  <FileChartLine className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8">
              <h2 className="text-3xl font-bold text-zinc-300 font-gau-pop-magic">Get Started</h2>
            </div>
          )}
        </main>
      </div>
    </Suspense>
  );
}
