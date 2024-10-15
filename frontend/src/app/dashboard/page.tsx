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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            {!isSidebarCollapsed && <h1 className="text-2xl font-bold">Keiko</h1>}
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarCollapsed ? <Menu /> : <ChevronsLeft />}
            </Button>
          </div>
          <nav>
            <Button
              variant="ghost"
              className={`w-full justify-start mb-2 ${isSidebarCollapsed ? "px-2" : ""}`}
              onClick={() => setActiveView("courses")}
            >
              {isSidebarCollapsed ? "C" : "Courses"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start mb-2 ${isSidebarCollapsed ? "px-2" : ""}`}>
              {isSidebarCollapsed ? "L" : "Library"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start mb-2 ${isSidebarCollapsed ? "px-2" : ""}`}>
              {isSidebarCollapsed ? "O" : "On-Going"}
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isSidebarCollapsed ? "px-2" : ""}`}>
              {isSidebarCollapsed ? "C" : "Completed"}
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search for courses" className="pl-10 pr-4 py-2 w-full" />
          </div>
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {activeView === "courses" ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Courses</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <ul>
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className={`mb-2 p-2 rounded cursor-pointer ${selectedCourse?.id === course.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
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
                    <h3 className="text-xl font-bold mb-2">{selectedCourse.name}</h3>
                    <p>{selectedCourse.description}</p>
                  </div>
                ) : (
                  <p>Select a course to view its details</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-4xl font-bold">Get Started</h2>
          </div>
        )}
      </main>
    </div>
  );
}
