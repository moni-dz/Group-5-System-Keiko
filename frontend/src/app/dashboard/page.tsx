"use client";

import {
  // search in https://lucide.dev/icons, add import here and use as component
  // e.g. circle-x is <CircleX /> imported as below when uncommented:
  // CircleX,
  Home,
  Search,
  Plus,
  Edit,
  Menu,
  ChevronsLeft,
  ClipboardList,
  Clock,
  BookCheck,
  Pen,
  CircleX,
  FolderClock,
  FileChartLine,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { redirect } from "next/navigation";
import { CourseData, getAllCourses } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTransitionRouter } from "next-view-transitions";

export default function MainPage() {
  const router = useTransitionRouter();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("default");
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  if (isPending) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    toast({ description: error.message });
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {error.message}
      </div>
    );
  }

  const courses = data;
  const ongoingCourses = courses.filter((course: CourseData) => !course.is_completed);
  const completedCourses = courses.filter((course: CourseData) => course.is_completed);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderCourseList = (courses: CourseData[]) => (
    <ul>
      {courses.map((course) => (
        <li
          key={course.id}
          className={`mb-2 p-2 rounded cursor-pointer ${
            selectedCourse?.id === course.id ? "bg-red-100" : "hover:bg-red-100"
          } font-semibold text-zinc-500`}
          onClick={() => {
            setSelectedCourse(course);
            setProgress(course.progress || 0);
          }}
        >
          {course.course_code}
        </li>
      ))}
    </ul>
  );

  const renderCourseDetails = (course: CourseData) => (
    <div>
      <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">{course.name}</h3>
      <p className="text-zinc-500 font-semibold">{course.description}</p>
      {course.progress !== undefined && (
        <div className="mt-2">
          <p className="text-zinc-500">Progress: {course.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <Progress value={progress} indicatorColor="bg-red-500" className="bg-gray-200 h-2.5" />
          </div>
        </div>
      )}
      {course.is_completed && (
        <p className="text-zinc-500 italic mt-2">Completed on: {dayjs(course.completion_date).format("MM-DD-YYYY")}</p>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen bg-gray-100 text-extrabold`}>
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${isSidebarCollapsed ? "w-16 bg-white text-zinc-500" : "w-64 bg-white shadow-md"}`}
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
              <Button
                variant="ghost"
                className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                onClick={() => setActiveView("courses")}
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

              <Button
                variant="ghost"
                className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                onClick={() => setActiveView("ongoing")}
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

              <Button
                variant="ghost"
                className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
                onClick={() => setActiveView("completed")}
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
            <Input type="text" placeholder="search for courses..." className="pl-10 pr-4 py-2 w-full" />
          </div>

          <Button variant="ghost" className="p-2" onClick={() => router.push("/")}>
            <Home className="h-5 w-5 text-red-500 bg-gray-100 hover:text-white hover:bg-red-500 rounded-sm" />
          </Button>
        </div>

        {activeView === "courses" ? (
          <div>
            <h2 className={`text-2xl font-bold mb-4 font-gau-pop-magic text-red-500`}>COURSES</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">{renderCourseList(courses)}</div>
              <div className="bg-white shadow-md rounded-lg p-4">
                {selectedCourse ? (
                  renderCourseDetails(selectedCourse)
                ) : (
                  <p className="text-zinc-500 italic">✦ select a course to view details...</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="space-x-2">
                <Button
                  className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => router.push("/courses")}
                >
                  <Plus className="mr-2 h-4 w-4 hover:text-white" />
                  Add
                </Button>
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
              <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">ON-GOING COURSES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">{renderCourseList(ongoingCourses)}</div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  {selectedCourse ? (
                    renderCourseDetails(selectedCourse)
                  ) : (
                    <p className="text-zinc-500 italic">✦ select a course to view details...</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2"
                onClick={() => redirect(`/review/${selectedCourse?.course_code}`)}
              >
                <Pen width="20" height="20" />
                <span>Start Quiz</span>
              </Button>
            </div>
          </div>
        ) : activeView === "completed" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">COMPLETED COURSES</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">{renderCourseList(completedCourses)}</div>
                <div className="bg-white shadow-md rounded-lg p-4">
                  {selectedCourse ? (
                    renderCourseDetails(selectedCourse)
                  ) : (
                    <p className="text-zinc-500 italic">✦ select a course to view details...</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                <FolderClock width="20" height="20" />
                <span>Mark as Ongoing</span>
              </Button>
              <Button className="bg-white text-red-500 border border-red-500 hover:border-zinc-500 hover:bg-zinc-500 hover:text-white flex items-center space-x-2">
                <FileChartLine width="24" height="24" />
                <span>Course Analytics</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className={`text-3xl font-bold text-zinc-300 font-gau-pop-magic`}>Get Started</h2>
          </div>
        )}
      </main>
    </div>
  );
}
