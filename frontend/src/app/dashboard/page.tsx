"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Search, Plus, Edit, Menu, ChevronsLeft } from "lucide-react";

export default function MainPage() {
  const [activeView, setActiveView] = useState("default");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  interface Course {
    id: number;
    name: string;
    description: string;
  }

  const courses: Course[] = [
    { id: 1, name: "DSA", description: "Data Structures and Algorithms" },
    { id: 2, name: "ENGLISH", description: "English Language and Literature" },
    { id: 3, name: "MATH", description: "Advanced Mathematics" },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`flex h-screen bg-gray-100 text-extrabold`}>
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${isSidebarCollapsed ? "w-16 bg-white text-zinc-500" : "w-64 bg-white shadow-md"}`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex-1">
            <div className="flex justify-center items-center mb-6">
              {!isSidebarCollapsed && (
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clipboard-list"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clipboard-list inline-block mr-2"
                    >
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M12 11h4" />
                      <path d="M12 16h4" />
                      <path d="M8 11h.01" />
                      <path d="M8 16h.01" />
                    </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clock inline-block mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-book-check"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <path d="m9 9.5 2 2 4-4" />
                  </svg>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-check inline-block mr-2"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                      <path d="m9 9.5 2 2 4-4" />
                    </svg>
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
            <Input type="text" placeholder="search for courses..." className="  pl-10 pr-4 py-2 w-full" />
          </div>
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <Home className="h-5 w-5 text-red-500 bg-gray-100 hover:text-white hover:bg-red-500 rounded-sm " />
            </Button>
          </Link>
        </div>

        {activeView === "courses" ? (
          <div>
            <h2 className={`text-2xl font-bold mb-4 font-gau-pop-magic text-red-500`}>COURSES</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <ul>
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className={`mb-2 p-2 rounded cursor-pointer ${selectedCourse?.id === course.id ? "bg-red-100" : "hover:bg-red-100"} ${["DSA", "MATH", "ENGLISH"].includes(course.name) ? "font-semibold text-zinc-500" : ""}`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      {course.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                {selectedCourse ? (
                  <div>
                    <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">{selectedCourse.name}</h3>
                    <p className="text-zinc-500 font-semibold">{selectedCourse.description}</p> 
                  </div>
                ) : (
                  <p className="text-zinc-500 italic">✦ select a course to view details...</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="space-x-2">
                <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                  <Plus className="mr-2 h-4 w-4 hover:text-white" /> Add
                </Button>
                <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-x mr-2 h-4 w-4 hover:text-white"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m15 9-6 6"/>
                    <path d="m9 9 6 6"/>
                  </svg>
                  Delete
                </Button>
              </div>
              <Button className="bg-white text-red-500 border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
          
       ) : activeView === "ongoing" ? (
        <div className="space-y-4">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-xl font-bold font-gau-pop-magic text-red-500">ON-GOING COURSES</h2>
            {/* Content for ongoing courses */}
          </div>
          <div className="mt-4">
            <Link href="/quiz">
              <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pen"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                </svg>
                <span>Start Quiz</span>
              </Button>
            </Link>
          </div>
        </div>
        ) : activeView === "completed" ? (
          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg p-8">
              <h2 className="text-xl font-bold font-gau-pop-magic text-red-500">COMPLETED COURSES</h2>
              {/* Content for completed courses */}
            </div>
            <div className="mt-4">
              <Button className="bg-red-500 text-white hover:bg-zinc-500 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-folder-clock"
                >
                  <circle cx="16" cy="16" r="6"/>
                  <path d="M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2"/>
                  <path d="M16 14v2l1 1"/>
                </svg>
                <span>Mark as Ongoing</span>
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
