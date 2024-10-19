"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { EditableCourse, SkeletonCard } from "@/components/cards";
import { useRouter } from "next/navigation";
import { addCourse, CourseData, deleteCourse, getAllCourses, updateCourse } from "@/lib/api";

export default function CoursesPage() {
  type FormData = Pick<CourseData, "name" | "course_code" | "description">;

  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    course_code: "",
    description: "",
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getAllCourses();
      setCourses(data);
    };

    fetchData().catch(() => setError("Failed to fetch data."));
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        const updatedCourse: CourseData = await updateCourse({
          id: editingId,
          name: formData.name,
          course_code: formData.course_code,
          description: formData.description,
        });

        setCourses(courses.map((course: CourseData): CourseData => (course.id === editingId ? updatedCourse : course)));
        setEditingId(null);

        if (!error) {
          toast({ description: "Course successfully edited." });
        }
      } else {
        const course: CourseData = await addCourse({ ...formData });

        setCourses([...courses, course]);

        if (!error) {
          toast({ description: "Course added." });
        }
      }

      setFormData({ name: "", course_code: "", description: "" });
    } catch (err) {
      setError("Failed to save item.");

      console.error(err);
    } finally {
      setLoading(false);

      if (error) {
        toast({ description: error });
      }
    }
  };

  const handleEdit = (course: CourseData) => {
    setEditingId(course.id);
    setFormData({
      course_code: course.course_code,
      name: course.name,
      description: course.description,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteCourse(id);
      setCourses(courses.filter((course: CourseData): boolean => course.id !== id));
    } catch {
      setError("Failed to delete course.");
    } finally {
      setLoading(false);

      if (!error) {
        toast({ description: "Course deleted." });
      } else {
        toast({ description: error });
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course_code">Course Code</Label>
              <Input
                className="bg-white"
                id="course_code"
                name="course_code"
                value={formData.course_code}
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
            {courses.map((course: CourseData) => (
              <EditableCourse course={course} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
