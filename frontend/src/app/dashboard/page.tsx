import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllCourses, getAllQuizzes } from "@/lib/api";
import Dashboard from "./dashboard";
import { getQueryClient } from "@/app/query-client";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
