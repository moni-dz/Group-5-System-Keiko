"use client";

import { SkeletonCard } from "@/components/cards";
import { ErrorSkeleton } from "@/components/status";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/cards";
import { useToast } from "@/hooks/use-toast";
import {
  CardData,
  getCardsByQuizId,
  getQuiz,
  setQuizCompletion,
  setQuizCorrectCount,
  setQuizCurrentIndex,
  setQuizHintUsed,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useTransitionRouter } from "next-view-transitions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizProps {
  quiz_id: string;
}

export default function Quiz(props: QuizProps) {
  const { quiz_id } = props;
  const queryClient = useQueryClient();
  const router = useTransitionRouter();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const { toast } = useToast();

  const { data: quiz } = useSuspenseQuery({
    queryKey: ["quiz", quiz_id],
    queryFn: () => getQuiz(quiz_id),
  });

  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards", quiz_id],
    queryFn: () => getCardsByQuizId(quiz_id),
  });

  useEffect(() => {
    setCurrentCardIndex(quiz?.current_index ?? 0);
    setCorrectCount(quiz?.correct_count ?? 0);
    setIsHintUsed(quiz?.hint_used ?? false);
    if (cards.length > 0 && quiz) generateAnswerOptions(cards, quiz.current_index);

    return () => {
      queryClient.invalidateQueries({ queryKey: [`quiz_${quiz_id}`, `cards_${quiz_id}`] });
    };
  }, [cards, quiz, queryClient, quiz_id]);

  const setCurrentIndexMutation = useMutation({
    mutationFn: (index: number) => setQuizCurrentIndex(quiz_id, index),
  }).mutate;

  const setCorrectCountMutation = useMutation({
    mutationFn: (correct_count: number) => setQuizCorrectCount(quiz_id, correct_count),
  }).mutate;

  const setHintUsedMutation = useMutation({
    mutationFn: (hint_used: boolean) => setQuizHintUsed(quiz_id, hint_used),
  }).mutate;

  const setFinishedMutation = useMutation({
    mutationFn: (is_completed: boolean) => setQuizCompletion(quiz_id, is_completed),
    onSuccess: () => {
      setShowCompletionDialog(false);
    },
  }).mutate;

  function generateAnswerOptions(cards: CardData[], idx: number) {
    const correctAnswer = cards[idx].answer;
    let options = cards.map((card) => card.answer);
    options = Array.from(new Set(options));
    if (!options.includes(correctAnswer)) {
      options.push(correctAnswer);
    }
    options = options.sort(() => 0.5 - Math.random());
    setAnswerOptions(options);
  }

  function handleSubmit() {
    if (selectedAnswer === cards[currentCardIndex].answer) {
      setMessage("Correct!");
      setCorrectCount(correctCount + 1);
      setCorrectCountMutation(correctCount);
    } else {
      setMessage("Incorrect answer!");
    }
    setIsSubmitted(true);
  }

  function handleNext() {
    if (currentCardIndex == cards.length - 1) {
      setShowCompletionDialog(true);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setCurrentIndexMutation(currentCardIndex);
      setSelectedAnswer("");
      setMessage("");
      setIsSubmitted(false);
      setIsHintUsed(false);
      setHintUsedMutation(false);
      generateAnswerOptions(cards, currentCardIndex + 1);
    }
  }

  function handleHint() {
    if (isHintUsed) {
      toast({
        description: "Hint already used for this question!",
        variant: "destructive",
      });
      return;
    }

    const correctAnswer = cards[currentCardIndex].answer;
    const incorrectAnswers = answerOptions.filter((answer) => answer !== correctAnswer);

    if (incorrectAnswers.length > 0) {
      // Randomly select one incorrect answer to remove
      const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
      const answerToRemove = incorrectAnswers[randomIndex];

      // Create new array without the removed answer
      const newOptions = answerOptions.filter((answer) => answer !== answerToRemove);
      setAnswerOptions(newOptions);
      setIsHintUsed(true);
      setHintUsedMutation(true);

      toast({
        description: "One incorrect answer has been removed!",
      });
    }
  }

  function handleExit() {
    setShowExitDialog(true);
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
          <Button
            variant="outline"
            className={`mr-2 text-white ${
              isHintUsed ? "bg-zinc-400" : "bg-red-500 hover:bg-zinc-500"
            } hover:text-white`}
            onClick={handleHint}
            disabled={isHintUsed || isSubmitted}
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button onClick={handleExit} variant="outline">
            <span className="bg-white-100 text-red-500">Exit</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {(!cards || cards.length === 0) && (
          <div className="text-center py-8 font-gau-pop-magic text-red-500 font-bold">
            NO CARDS AVAILABLE FOR THIS COURSE.
          </div>
        )}

        {!quiz?.is_completed && (
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

      {/* Completion Alert Dialog */}
      <AlertDialog open={showCompletionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-gau-pop-magic text-red-500">QUIZ COMPLETE!</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500">
              You&apos;ve reached the end of the quiz. Click mark as complete to exit!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setFinishedMutation(true);
                setCurrentIndexMutation(0);
                queryClient.invalidateQueries({ queryKey: ["quizzes"] });
                router.push("/dashboard?view=ongoing");
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Mark as Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Alert Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={() => setShowExitDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="ping-container">
              <div className="ping"></div>
              <AlertDialogTitle className="font-gau-pop-magic text-red-500">SAVE PROGRESS?</AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500">
                Would you like to save your progress before exiting?
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-red-500 hover:text-white border border-red-500 text-red-500 ">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className="bg-white-500 text-red-500 hover:text-white border border-red-500 hover:bg-red-500"
            >
              <Link href="/dashboard?view=ongoing">Save &amp; Exit</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
