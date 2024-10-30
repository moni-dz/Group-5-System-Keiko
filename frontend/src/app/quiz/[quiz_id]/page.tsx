"use client";

import { SkeletonCard } from "@/components/cards";
import { LoadingSkeleton, ErrorSkeleton } from "@/components/status";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/cards";
import { useToast } from "@/hooks/use-toast";
import { CardData, getCardsByQuizId, getQuiz, setQuizCompletion, setQuizCurrentIndex } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import { TimerState, useTimerStore } from "@/store/time";

interface QuizPageProps {
  params: Promise<{ quiz_id: string }>;
}

function useTimer(): Omit<TimerState, "setTimeLeft"> {
  const { timeLeft, isRunning, initialTime, setTimeLeft, startTimer, pauseTimer, resetTimer, setInitialTime } =
    useTimerStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTimeLeft]);

  return { timeLeft, isRunning, initialTime, startTimer, pauseTimer, resetTimer, setInitialTime };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { quiz_id } = use(params);
  const queryClient = useQueryClient();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    data: quiz,
    isError: isQuizError,
    isFetching: isQuizFetching,
    error: quizError,
  } = useQuery({
    queryKey: [`quiz_${quiz_id}`],
    queryFn: () => getQuiz(quiz_id),
  });

  const {
    data: cards,
    isError: isCardsError,
    isFetching: isCardsFetching,
    error: cardsError,
  } = useQuery({
    queryKey: [`cards_${quiz_id}`],
    queryFn: () => getCardsByQuizId(quiz_id),
    initialData: [],
  });

  const setCurrentIndexMutation = useMutation({
    mutationFn: (index: number) => setQuizCurrentIndex(quiz_id, index),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`quiz_${quiz_id}`],
      });
    },
  }).mutate;

  const setFinishedMutation = useMutation({
    mutationFn: (is_completed: boolean) => setQuizCompletion(quiz_id, is_completed),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`quiz_${quiz_id}`],
      });
    },
  }).mutate;

  useEffect(() => {
    if (cards.length > 0 && quiz) generateAnswerOptions(cards, quiz.current_index); // temporary
  }, [cards, quiz]);

  if (isQuizError || isCardsError) {
    toast({ description: "Failed to fetch cards." });
    return <ErrorSkeleton error={(quizError || cardsError) as Error} />;
  }

  if (isQuizFetching) return <LoadingSkeleton />;
  if (isCardsFetching) return <SkeletonCard />;

  const currentCardIndex = quiz?.current_index ?? 0;

  const generateAnswerOptions = (cards: CardData[], idx: number) => {
    const correctAnswer = cards[idx].answer;
    let options = cards.map((card) => card.answer);
    options = Array.from(new Set(options));
    if (!options.includes(correctAnswer)) {
      options.push(correctAnswer);
    }
    options = options.sort(() => 0.5 - Math.random());
    setAnswerOptions(options);
  };

  function handleSubmit() {
    if (selectedAnswer === cards[currentCardIndex].answer) {
      setMessage("Correct!");
    } else {
      setMessage("Incorrect. Try again!");
    }
    setIsSubmitted(true);
  }

  function handleNext() {
    if (currentCardIndex == cards.length - 1) {
      setFinishedMutation(true);
    } else {
      setCurrentIndexMutation(currentCardIndex + 1);
      setSelectedAnswer("");
      setMessage("");
      setIsSubmitted(false);
    }
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <header className="sticky top-0 z-10 bg-transparent flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-gau-pop-magic">
          <span className="text-red-500">QUIZ: </span>
          <span className="text-zinc-500">
            {quiz?.course_code} - {quiz?.category}
          </span>
        </h1>
        <div className="flex items-center">
          <Button variant="outline" className="mr-2 text-white bg-red-500 hover:bg-zinc-500 hover:text-white">
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard?view=ongoing" className="bg-white-100 hover:bg-zinc-500 text-red-500 hover:text-white">
              Exit
            </a>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!cards || cards.length === 0 ? (
          <div className="text-center py-8 font-gau-pop-magic text-red-500 font-bold">
            NO CARDS AVAILABLE FOR THIS COURSE.
          </div>
        ) : quiz?.is_completed ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold font-gau-pop-magic text-red-500 mb-4">Quiz Completed!</h2>
            <Link href="/dashboard?view=ongoing">
              <Button className="bg-white-100 hover:bg-zinc-500 text-red-500 hover:text-white" variant="outline">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <QuizCard
            question={currentCard.question}
            answerOptions={answerOptions}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            isSubmitted={isSubmitted}
            correctAnswer={currentCard.answer}
            message={message}
            onSubmit={handleSubmit}
            onNext={handleNext}
          />
        )}
      </main>
    </div>
  );
}
