"use client";

import { use, useState } from "react";
import { SkeletonCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { getCardsByQuizId, getQuiz } from "@/lib/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ErrorSkeleton } from "@/components/status";

const Flashcard = dynamic(() => import("@/components/cards").then((mod) => mod.Flashcard), {
  loading: () => <SkeletonCard />,
});

interface ReviewPageProps {
  params: Promise<{ quiz_id: string }>;
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const { quiz_id } = use(params);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const {
    data: quiz,
    isFetching: isQuizFetching,
    isError: isQuizError,
    error: quizError,
  } = useQuery({
    queryKey: ["quiz", quiz_id],
    queryFn: () => getQuiz(quiz_id),
  });

  const {
    data: cards,
    isFetching: isCardsFetching,
    isError: isCardsError,
    error: cardsError,
  } = useQuery({
    queryKey: ["cards", quiz_id],
    queryFn: () => getCardsByQuizId(quiz_id),
    initialData: [],
  });

  const handlePrevCard = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(currentCardIndex - 1);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) setCurrentCardIndex(currentCardIndex + 1);
  };

  if (isQuizFetching || isCardsFetching) return <SkeletonCard />;

  if (isQuizError || isCardsError)
    return <ErrorSkeleton error={isQuizError ? quizError : isCardsError ? cardsError : undefined} />;

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-start p-4">
        <div className="flex items-center">
          <span className="text-red-500 font-gau-pop-magic text-2xl font-bold">REVIEW:</span>
          <span className="text-zinc-500 ml-2 font-gau-pop-magic text-2xl">
            {quiz?.course_code} - {quiz?.category}
          </span>
        </div>
        <Link href="/dashboard?view=courses">
          <Button className="m-2 p-2 rounded-full hover:bg-red-50" variant="ghost">
            <Home className="w-6 h-6 text-red-500 rounded-sm" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-3xl mb-2 mt-10 font-gau-pop-magic text-red-500 font-bold"></h1>
      </div>

      <div className="space-y-4 mt-4">
        <div className="grid grid-rows-2 gap-5">
          <Link href="/dashboard">
            <Button asChild>Go Back</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-4">
          {isCardsFetching ? <SkeletonCard /> : cards.length > 0 && <Flashcard {...cards[currentCardIndex]} />}
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <Button onClick={handlePrevCard} disabled={currentCardIndex === 0} variant="ghost">
          <ArrowLeft className="w-6 h-6 text-zinc-500 hover:text-red-500" />
        </Button>
        <Button onClick={handleNextCard} disabled={currentCardIndex === cards.length - 1} variant="ghost">
          <ArrowRight className="w-6 h-6 text-zinc-500 hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
}
