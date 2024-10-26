"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCourse } from "@/components/cards";
import { addCourse, CourseData, deleteCourse, getAllCourses, updateCourse } from "@/lib/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const EditableCourse = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCourse), {
  loading: () => <SkeletonEditableCourse />,
});

const formSchema = z.object({
  name: z.string().min(1, "Course name is required."),
  course_code: z.string().min(1, "Course code is required."),
  description: z.string().min(1, "Course description is required."),
});

export default function CoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      course_code: "",
      description: "",
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const onError = (e: Error) => {
    toast({ description: e.message });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

  const addCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "name" | "course_code" | "description">) => addCourse(course),
    onSuccess,
    onError,
  }).mutate;

  const updateCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => updateCourse(course),
    onSuccess,
    onError,
  }).mutate;

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess,
    onError,
  }).mutate;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingId) {
      updateCourseMutation({
        id: editingId,
        name: values.name,
        course_code: values.course_code,
        description: values.description,
      });

      setEditingId(null);
    } else {
      addCourseMutation(values);
    }
  }

  function handleEdit(course: Pick<CourseData, "id" | "name" | "course_code" | "description">) {
    setEditingId(course.id);
    form.setValue("name", course.name);
    form.setValue("course_code", course.course_code);
    form.setValue("description", course.description);
  }

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="course_code" className="text-zinc-500">
                      Course Code
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white text-zinc-500 border-zinc-500" />
                    </FormControl>
                    <FormDescription className="text-zinc-500">e.g. CS121</FormDescription>
                    <FormMessage>{form.formState.errors.course_code?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="text-zinc-500">
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white text-zinc-500 border-zinc-500" />
                    </FormControl>
                    <FormDescription className="text-zinc-500">e.g. Programming Languages</FormDescription>
                    <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description" className="text-zinc-500">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-white text-zinc-500 border-zinc-500 border p-2 rounded-md resize-none w-full"
                        rows={3}
                        style={{ overflowY: "auto" }}
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" className="bg-red-500 text-white hover:bg-zinc-500">
                {editingId ? "Update Course" : "Add Course"}
              </Button>
              <Link href="/dashboard?view=courses">
                <Button
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                  variant="ghost"
                >
                  <Home className="w-6 h-6 text-red-500 bg-gray rounded-sm" />
                </Button>
              </Link>
            </div>
          </form>
        </Form>

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
