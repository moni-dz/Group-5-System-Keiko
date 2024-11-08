"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCourse } from "@/components/cards";
import { addCourse, CourseData, deleteCourse, getAllCourses, updateCourse } from "@/lib/api";
import dynamic from "next/dynamic";
import { Home } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransitionRouter } from "next-view-transitions";
import Image from "next/image";
import logo from "@/public/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EditableCourse = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCourse), {
  loading: () => <SkeletonEditableCourse />,
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Course name is required."),
  course_code: z
    .string()
    .trim()
    .min(1, "Course code is required.")
    .refine((s) => !s.includes(" "), { message: "Course code cannot contain spaces." }),
  description: z.string().trim().min(1, "Course description is required."),
});

export default function Courses() {
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      course_code: "",
      description: "",
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const addCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "name" | "course_code" | "description">) => addCourse(course),

    onMutate: async (course) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData<CourseData[]>(["courses"]) || [];

      queryClient.setQueryData<CourseData[]>(["courses"], (old) => [
        ...(old || []),
        { ...course, id: "temp-id" } as CourseData,
      ]);

      return { previousCourses };
    },

    onError: (e, _, context) => {
      toast({ description: e.message });
      queryClient.setQueryData<CourseData[]>(["courses"], context?.previousCourses);
    },

    onSuccess: () => toast({ description: "Course added successfully." }),
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: ["courses"] }),
  }).mutate;

  const updateCourseMutation = useMutation({
    mutationFn: (course: Pick<CourseData, "id" | "name" | "course_code" | "description">) => updateCourse(course),

    onMutate: async (course) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData<CourseData[]>(["courses"]) || [];

      queryClient.setQueryData<CourseData[]>(["courses"], (old) =>
        old?.map((c) => (c.id === course.id ? { ...c, ...course } : c)),
      );

      return { previousCourses };
    },

    onError: (e, _, context) => {
      toast({ description: e.message });
      queryClient.setQueryData<CourseData[]>(["courses"], context?.previousCourses);
    },

    onSuccess: () => toast({ description: "Course updated successfully." }),
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: ["courses"] }),
  }).mutate;

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      const previousCourses = queryClient.getQueryData<CourseData[]>(["courses"]) || [];

      queryClient.setQueryData<CourseData[]>(["courses"], (old) => old?.filter((c) => c.id !== id));

      return { previousCourses };
    },

    onError: (e, _, context) => {
      toast({ description: e.message });
      queryClient.setQueryData<CourseData[]>(["courses"], context?.previousCourses);
    },

    onSuccess: () => toast({ description: "Course deleted successfully." }),
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: ["courses"] }),
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

    form.setValue("name", "");
    form.setValue("course_code", "");
    form.setValue("description", "");
  }

  function handleEdit(course: Pick<CourseData, "id" | "name" | "course_code" | "description">) {
    setEditingId(course.id);
    form.setValue("name", course.name);
    form.setValue("course_code", course.course_code);
    form.setValue("description", course.description);
  }

  function handleDeleteClick(id: string) {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    if (courseToDelete) {
      deleteCourseMutation(courseToDelete);
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  }

  const handleManageCourses = (course_code: string) => router.push(`/manage?course=${encodeURI(course_code)}`);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-4">
          <Image src={logo.src} alt="Logo" className="h-10 mr-4" width={42.5} height={42.5} />
          <h1 className="text-2xl font-semibold font-gau-pop-magic text-red-500">MANAGE COURSES</h1>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((course: CourseData) => (
            <EditableCourse
              key={course.id}
              course={course}
              handleEdit={handleEdit}
              handleDelete={handleDeleteClick}
              handleManageCourses={handleManageCourses}
              className="text-zinc-500 border-zinc-500"
            />
          ))}
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-gau-pop-magic text-red-500 font-bold">ARE YOU SURE?</AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;re deleting a course. This action is irreversible!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-red-500 hover:bg-zinc-500 hover:text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white hover:bg-zinc-500 hover:text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
