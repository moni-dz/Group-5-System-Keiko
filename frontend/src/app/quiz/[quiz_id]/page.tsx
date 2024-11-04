import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getQuiz, getCardsByQuizId } from "@/lib/api";
import Quiz from "./../quiz";

interface QuizPageProps {
  params: Promise<{ quiz_id: string }>;
}

export default async function QuizPage(props: QuizPageProps) {
  const { quiz_id } = await props.params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["quiz", quiz_id],
    queryFn: () => getQuiz(quiz_id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["cards", quiz_id],
    queryFn: () => getCardsByQuizId(quiz_id),
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Quiz quiz_id={quiz_id} />
    </HydrationBoundary>
  );
}
