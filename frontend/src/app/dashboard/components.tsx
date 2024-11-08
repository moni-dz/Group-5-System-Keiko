import { Progress } from "@/components/ui/progress";
import { CourseData, QuizData } from "@/lib/api";
import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookCheck, ChevronsLeft, ClipboardList, Clock, Menu } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Options } from "nuqs";

interface CourseListProps {
  courses: CourseData[];
  selectedCourse: string;
  setSelectedCourse: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;
}

export function CourseList(props: CourseListProps) {
  const { courses, selectedCourse, setSelectedCourse } = props;

  return (
    <ul>
      {courses.map((course) => (
        <li
          key={course.id}
          onClick={() => setSelectedCourse(course.course_code)}
          className={`mb-2 p-2 rounded cursor-pointer ${
            selectedCourse === course.course_code ? "bg-red-100" : "hover:bg-red-100"
          } font-semibold text-zinc-500`}
        >
          {course.course_code}
        </li>
      ))}
    </ul>
  );
}

interface CourseDetailsProps {
  course_code: string;
  courses: CourseData[];
}

export function CourseDetails(props: CourseDetailsProps) {
  const { course_code, courses } = props;
  const course = courses.find((course) => course.course_code === course_code);

  return course === undefined ? (
    <p className="text-zinc-500 italic">✦ select a course to view details...</p>
  ) : (
    <div>
      <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">
        {course.name || "Course Name"}
      </h3>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Course Code:</span> {course.course_code || "N/A"}
      </p>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Description:</span> {course.description || "No description available."}
      </p>

      {course.progress !== undefined && (
        <div className="mt-2">
          <p className="text-zinc-500">Progress: {course.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <Progress value={course.progress} indicatorColor="bg-red-500" className="bg-gray-200 h-2.5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface QuizListProps {
  quizzes: QuizData[];
  selectedQuiz: string;
  setSelectedQuiz: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;
}

export function QuizList(props: QuizListProps) {
  const { quizzes, selectedQuiz, setSelectedQuiz } = props;

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li
          key={quiz.id}
          onClick={() => setSelectedQuiz(quiz.id)}
          className={`mb-2 p-2 rounded cursor-pointer ${
            selectedQuiz === quiz.id ? "bg-red-100" : "hover:bg-red-100"
          } font-semibold text-zinc-500`}
        >
          {quiz.course_code} - {quiz.category}
        </li>
      ))}
    </ul>
  );
}

interface QuizDetailsProps {
  quizId: string;
  quizzes: QuizData[];
}

export function QuizDetails(props: QuizDetailsProps) {
  const { quizId, quizzes } = props;
  const quiz = quizzes.find((quiz) => quiz.id === quizId);

  if (quiz === undefined) {
    return <p className="text-zinc-500 italic">✦ select a quiz to view details...</p>;
  }

  return (
    <div>
      <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">
        {quiz.category || "Quiz Name"}
      </h3>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Course Code:</span> {quiz.course_code || "N/A"}
      </p>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Number of Questions:</span>{" "}
        {quiz.card_count != 0 ? `${quiz.card_count} questions` : "N/A"}
      </p>

      {quiz.progress !== undefined && (
        <div className="mt-2">
          <p className="text-zinc-500">Progress: {quiz.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <Progress value={quiz.progress} indicatorColor="bg-red-500" className="bg-gray-200 h-2.5" />
          </div>
        </div>
      )}
      {quiz.is_completed && (
        <p className="text-zinc-500 italic mt-2">Completed on: {dayjs(quiz.completed_at).format("MM-DD-YYYY")}</p>
      )}
    </div>
  );
}

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeView: string | null;
  setActiveView: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const { collapsed, setCollapsed, activeView, setActiveView } = props;

  const items = [
    {
      view: "courses",
      icon: ClipboardList,
      label: "Courses",
    },
    {
      view: "ongoing",
      icon: Clock,
      label: "On-Going",
    },
    {
      view: "completed",
      icon: BookCheck,
      label: "Completed",
    },
  ];

  return (
    <div
      className={cn("h-full transition-all duration-300 flex-shrink-0 overflow-hidden", collapsed ? "w-16" : "w-64")}
    >
      <Sidebar
        className={cn("border-r border-border bg-white transition-all duration-300", collapsed ? "w-16" : "w-64")}
      >
        <SidebarHeader className="p-4">
          <Link href="/">
            <div className="flex justify-center items-center">
              {collapsed ? (
                <Image src={logo} alt="logo" className="w-8 h-8" />
              ) : (
                <h1 className="text-3xl font-bold font-gau-pop-magic text-red-500 text-center">Keiko!</h1>
              )}
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-full px-2">
            <nav className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center text-zinc-500",
                      collapsed ? "justify-center px-2" : "justify-start",
                      "hover:bg-red-500 hover:text-white transition-colors",
                      activeView === item.view && "bg-red-500 text-white",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
                    {!collapsed && item.label}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="w-full">
            {collapsed ? <Menu className="h-5 w-5 text-zinc-500" /> : <ChevronsLeft className="h-5 w-5 text-red-500" />}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
