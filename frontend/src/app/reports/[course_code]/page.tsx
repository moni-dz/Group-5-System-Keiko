import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCourseByCode, getAllQuizzes } from "@/lib/api";
import Reports from "./../reports";
import { getQueryClient } from "@/app/query-client";

interface ReportsPageProps {
  params: Promise<{ course_code: string }>;
}

export default async function ReportsPage(props: ReportsPageProps) {
  const { course_code } = await props.params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["course", course_code],
    queryFn: () => getCourseByCode(course_code),
  });

  queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Reports course_code={course_code} />
    </HydrationBoundary>
  );
}
