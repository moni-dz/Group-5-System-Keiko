import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllCourses, getAllQuizzes } from "@/lib/api";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    initialData: [],
  });

  await queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
