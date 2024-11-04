import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllCards, getAllQuizzes } from "@/lib/api";
import Manage from "./manage";
import { getQueryClient } from "../query-client";

export default async function ManagePage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["cards"],
    queryFn: getAllCards,
  });

  queryClient.prefetchQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Manage />
    </HydrationBoundary>
  );
}
