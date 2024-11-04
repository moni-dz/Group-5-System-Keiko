import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllCourses } from "@/lib/api";
import Courses from "./courses";
import { getQueryClient } from "../query-client";

export default async function CoursesPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Courses />
    </HydrationBoundary>
  );
}
