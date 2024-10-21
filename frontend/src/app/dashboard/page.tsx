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
} from "lucide-react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CourseData, getAllCourses } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import DashboardLoading from "./loading";
import { CourseDetails, CourseList } from "./components";

export default function MainPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const activeView = searchParams.get("view") || "";
  const selectedCourse = searchParams.get("course") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  if (isPending) {
    return <DashboardLoading />;
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

  const filterCourses = (courses: CourseData[], query: string) => {
    return courses.filter(
      (course) =>
        course.course_code.toLowerCase().includes(query.toLowerCase()) ||
        course.name.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const filteredCourses = filterCourses(courses, searchQuery);
  const filteredOngoingCourses = filterCourses(ongoingCourses, searchQuery);
  const filteredCompletedCourses = filterCourses(completedCourses, searchQuery);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <Suspense fallback={<DashboardLoading />}>
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
                <Link href="?view=courses">
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
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
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
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
                    className={`w-full flex items-center mb-2 text-1.5xl text-zinc-500 ${isSidebarCollapsed ? `px-2 font-gau-pop-magic` : ""} justify-start hover:bg-red-500 active:bg-red-500 hover:text-white active:text-white`}
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
                placeholder="search for courses..."
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
                <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">ON-GOING COURSES</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <CourseList courses={filteredOngoingCourses} activeView={activeView} course_code={selectedCourse} />
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <CourseDetails courses={filteredOngoingCourses} course_code={selectedCourse} />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/quiz/${selectedCourse}`}>
                  <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                    <Pen width="20" height="20" />
                    <span>Start Quiz</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : activeView === "completed" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-gau-pop-magic text-red-500 mb-4">COMPLETED COURSES</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <CourseList
                      courses={filteredCompletedCourses}
                      activeView={activeView}
                      course_code={selectedCourse}
                    />
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <CourseDetails courses={filteredCompletedCourses} course_code={selectedCourse} />
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
    </Suspense>
  );
}
