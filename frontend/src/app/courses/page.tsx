"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SkeletonCard } from "@/components/flashcard";
import { useRouter } from "next/navigation";

interface CourseData {
  id: string;
  courseCode: string;
  name: string;
  description: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      // update
      const updatedCourses = courses.map((course) =>
        course.id === editingId
          ? {
              ...course,
              courseCode: formData.courseCode,
              name: formData.name,
              description: formData.description,
            }
          : course,
      );
      setCourses(updatedCourses);
      setEditingId(null);
      toast({ description: "Course successfully edited." });
    } else {
      // add
      const newCourse: CourseData = {
        id: Date.now().toString(),
        courseCode: formData.courseCode,
        name: formData.name,
        description: formData.description,
      };
      setCourses([...courses, newCourse]);
      toast({ description: "Course added." });
    }

    setFormData({ courseCode: "", name: "", description: "" });
    setLoading(false);
  };

  const handleEdit = (course: CourseData) => {
    setEditingId(course.id);
    setFormData({
      courseCode: course.courseCode,
      name: course.name,
      description: course.description,
    });
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    toast({ description: "Course deleted." });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                className="bg-white"
                id="courseCode"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input
                className="bg-white"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                className="bg-white"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" className="bg-red-600 text-white" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingId ? "Update Course" : "Add Course"}
            </Button>
            <Button className="bg-red-600 text-white" onClick={() => router.push("/dashboard")}>
              Go Back
            </Button>
          </div>
        </form>

        {loading && !courses.length ? (
          <>
            {[...Array(3).keys()].map(() => (
              <SkeletonCard />
            ))}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold">
                  {course.courseCode} - {course.name}
                </h3>
                <p>{course.description}</p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleEdit(course)}>Edit</Button>
                  <Button onClick={() => handleDelete(course.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
