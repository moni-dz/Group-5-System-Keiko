import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllCards, getAllQuizzes } from "@/lib/api";
import Manage from "./manage";

export default async function ManagePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["cards"],
    queryFn: getAllCards,
    initialData: [],
  });

  await queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Manage />
    </HydrationBoundary>
  );
}
