import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllCourses } from "@/lib/api";
import Courses from "./courses";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Courses />
    </HydrationBoundary>
  );
}
