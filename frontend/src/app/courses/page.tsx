"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCard } from "@/components/cards";
import { addCourse, CourseData, deleteCourse, getAllCourses, updateCourse } from "@/lib/api";
import dynamic from "next/dynamic";
import { useTransitionRouter } from "next-view-transitions";

const EditableCourse = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCourse), {
  loading: () => <SkeletonEditableCard />,
});

export default function CoursesPage() {
  type FormData = Pick<CourseData, "name" | "course_code" | "description">;

  const router = useTransitionRouter();
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

  const useAddCourse = useMutation({
    mutationFn: (course: Pick<CourseData, "name" | "course_code" | "description">) => addCourse(course),
    onSuccess: onSuccess,
    onError: onError,
  });

  const useUpdateCourse = useMutation({
    mutationFn: (course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => updateCourse(course),
    onSuccess: onSuccess,
    onError: onError,
  });

  const useDeleteCourse = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: onSuccess,
    onError: onError,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      useUpdateCourse.mutate({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      useAddCourse.mutate(formData);
    }

    setFormData({ name: "", course_code: "", description: "" });
  };

  const handleEdit = useCallback((course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => {
    setEditingId(course.id);
    setFormData({ ...course });
  }, []);

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
            <Button type="submit" className="bg-red-600 text-white">
              {editingId ? "Update Course" : "Add Course"}
            </Button>
            <Button className="bg-red-600 text-white" onClick={() => router.push("/dashboard")}>
              Go Back
            </Button>
          </div>
        </form>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6).keys()].map((i: number) => (
              <SkeletonEditableCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((course: CourseData) => (
              <EditableCourse
                key={course.id}
                course={course}
                handleEdit={handleEdit}
                handleDelete={(id) => useDeleteCourse.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
