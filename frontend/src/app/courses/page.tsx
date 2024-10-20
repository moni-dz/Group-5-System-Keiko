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
  type FormData = Pick<CourseData, "name" | "course_code" | "description">;

  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    course_code: "",
    description: "",
    fields: [{ term: "", definition: "" }],
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
  }).mutate;

  const useUpdateCourse = useMutation({
    mutationFn: (course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => updateCourse(course),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const useDeleteCourse = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFields = formData.fields.map((field, i) =>
      i === index ? { ...field, [name]: value } : field
    );
    setFormData((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        <h1 className="text-2xl font-bold mb-4 font-gau-pop-magic text-red-500">Manage Courses</h1>
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
              <Label htmlFor="name" className="text-zinc-500">Course Name</Label>
              <Input
                className="bg-white text-zinc-500 placeholder:text-zinc-500"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-zinc-500">Description</Label>
              <textarea
                className="bg-white w-full border border-gray-300 rounded-lg shadow-sm p-2 text-zinc-500 placeholder:text-zinc-500 resize-none"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* border to separate question fields */}
          <hr className="my-6 border-t-2 border-gray-300" />

          {formData.fields.map((field, index) => (
            <div key={index} className="flex gap-4 mt-4 text-zinc-500">
              <div className="w-full">
                <Label htmlFor={`term-${index}`} className="text-zinc-500">Term or Question</Label>
                <textarea
                  className="bg-white w-full border border-gray-300 rounded-lg shadow-sm p-2 text-zinc-500 placeholder:text-zinc-500 resize-none"
                  id={`term-${index}`}
                  name="term"
                  value={field.term}
                  onChange={(e) => handleFieldChange(index, e)}
                  ref={(el) => {
                    if (el) {
                      textAreaRefs.current[index] = el;
                    }
                  }}  
                />
              </div>
              <div className="w-full">
                <Label htmlFor={`definition-${index}`} className="text-zinc-500">Definition or Answer</Label>
                <textarea
                  className="bg-white w-full border border-gray-300 rounded-lg shadow-sm p-2 text-zinc-500 placeholder:text-zinc-500 resize-none"
                  id={`definition-${index}`}
                  name="definition"
                  value={field.definition}
                  onChange={(e) => handleFieldChange(index, e)}
                  ref={(el) => {
                    if (el) {
                      textAreaRefs.current[index + 1] = el;
                    }
                  }} 
                />
              </div>
              <Button
                className="bg-red-500 text-white mt-6 hover:bg-zinc-500 p-2"
                onClick={() => removeField(index)}
              >
                <Trash2 className="w-6 h-6" />
              </Button>
            </div>
          ))}

          <Button type="button" className="bg-red-500 text-white mt-4 hover:bg-zinc-500" onClick={addField}>
            Add new card
          </Button>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" className="bg-red-600 text-white" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingId ? "Update Course" : "Add Course"}
            </Button>
            <Button className="bg-red-500 text-white hover:bg-zinc-500" onClick={() => router.push("/dashboard")}>
              Back
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
