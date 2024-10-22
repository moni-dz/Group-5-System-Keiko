"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCourse } from "@/components/cards";
import { addCourse, CourseData, deleteCourse, getAllCourses, updateCourse } from "@/lib/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const EditableCourse = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCourse), {
  loading: () => <SkeletonEditableCourse />,
});

export default function CoursesPage() {
  type FormData = Pick<CourseData, "name" | "course_code" | "description">;

  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    course_code: "",
    description: "",
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const onError = (e: Error) => {
    toast({ description: e.message });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["courses"],
    });
  };

  const addCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "name" | "course_code" | "description">) => addCourse(course),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const updateCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => updateCourse(course),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));

    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto"; //
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateCourseMutation({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      addCourseMutation(formData);
    }

    setFormData({ name: "", course_code: "", description: "" });
  };

  const handleEdit = useCallback((course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => {
    setEditingId(course.id);
    setFormData({ ...course });
  }, []);

  const handleManageCourses = useCallback((course_code: string) => router.push(`/manage/${course_code}`), [router]);

  if (isError) {
    toast({ description: error.message });
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {error.message}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4 font-gau-pop-magic text-red-500">MANAGE COURSES</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course_code" className="text-zinc-500">
                Course Code
              </Label>
              <Input
                className="bg-white text-zinc-500 border-zinc-500"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-zinc-500">
                Course Name
              </Label>
              <Input
                className="bg-white text-zinc-500 border-zinc-500"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-zinc-500">
                Description
              </Label>
              <textarea
                className="bg-white text-zinc-500 border-zinc-500 border p-2 rounded-md resize-none w-full"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                style={{ overflowY: "auto" }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" className="bg-red-500 text-white hover:bg-zinc-500">
              {editingId ? "Update Course" : "Add Course"}
            </Button>
            <Button className="bg-red-500 text-white hover:bg-zinc-500" onClick={() => router.push("/dashboard")}>
              Back
            </Button>
          </div>
        </form>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6).keys()].map((i: number) => (
              <SkeletonEditableCourse key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((course: CourseData) => (
              <EditableCourse
                key={course.id}
                course={course}
                handleEdit={handleEdit}
                handleDelete={deleteCourseMutation}
                handleManageCourses={handleManageCourses}
                className="text-zinc-500 border-zinc-500"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
