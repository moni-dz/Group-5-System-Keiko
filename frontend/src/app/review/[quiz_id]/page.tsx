import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getQuiz, getCardsByQuizId } from "@/lib/api";
import Review from "./../review";

interface ReviewPageProps {
  params: Promise<{ quiz_id: string }>;
}

export default async function ReviewPage(props: ReviewPageProps) {
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
      <Review quiz_id={quiz_id} />
    </HydrationBoundary>
  );
}
