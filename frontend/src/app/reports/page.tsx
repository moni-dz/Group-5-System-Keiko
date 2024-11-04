import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCourseByCode, getAllQuizzes } from "@/lib/api";
import Reports from "./reports";

interface ReportsPageProps {
  params: Promise<{ course_code: string }>;
}

export default async function ReportsPage(props: ReportsPageProps) {
  const { course_code } = await props.params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["course", course_code],
    queryFn: () => getCourseByCode(course_code),
  });

  await queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Reports />
    </HydrationBoundary>
  );
}
