import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQuiz, getCardsByQuizId } from "@/lib/api";
import Review from "./../review";
import { getQueryClient } from "@/app/query-client";

interface ReviewPageProps {
  params: Promise<{ quiz_id: string }>;
}

export default async function ReviewPage(props: ReviewPageProps) {
  const { quiz_id } = await props.params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["quiz", quiz_id],
    queryFn: () => getQuiz(quiz_id),
  });

  queryClient.prefetchQuery({
    queryKey: ["cards", quiz_id],
    queryFn: () => getCardsByQuizId(quiz_id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Review quiz_id={quiz_id} />
    </HydrationBoundary>
  );
}
