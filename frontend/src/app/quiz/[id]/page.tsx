"use client";

import { SkeletonCard } from "@/components/cards";
import { LoadingSkeleton, ErrorSkeleton } from "@/components/status";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CardData, getCardsByQuizId, getQuiz, setQuizCurrentIndex } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { use, useEffect, useState } from "react";

interface QuizCardProps {
  question: string;
  answerOptions: string[];
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  isSubmitted: boolean;
  correctAnswer: string;
  message: string;
  onSubmit: () => void;
  onNext: () => void;
}

function QuizCard({
  question,
  answerOptions,
  selectedAnswer,
  setSelectedAnswer,
  isSubmitted,
  correctAnswer,
  message,
  onSubmit,
  onNext,
}: QuizCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      onNext();
      setTimeout(() => setIsFlipping(false), 500);
    }, 250);
  };

  return (
    <div className="w-full [perspective:1000px]">
      <div
        className={`relative w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isSubmitted ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute w-full [backface-visibility:hidden] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-start border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <CardTitle
              className={`text-2xl text-center text-zinc-500 mb-6 transition-opacity duration-250 ${
                isFlipping ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="max-h-[60vh] overflow-y-auto">{question}</div>
            </CardTitle>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-4 w-full mb-8 max-h-[40vh] overflow-y-auto"
            >
              {answerOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 ${
                    selectedAnswer === option ? "bg-red-100 text-zinc-500 rounded-lg" : "text-zinc-500"
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className={`${selectedAnswer === option ? "border-zinc-500" : ""}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`${selectedAnswer === option ? "text-zinc-700" : "text-zinc-600"}`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={onSubmit}
              disabled={isSubmitted || !selectedAnswer}
              className="bg-zinc-600 text-white hover:bg-red-500 transition-colors font-gau-pop-magic mt-auto"
            >
              SUBMIT ANSWER
            </Button>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <p
              className={`text-xl font-gau-pop-magic font-bold mb-4 ${message === "Correct!" ? "text-red-500" : "text-zinc-500"}`}
            >
              {message}
            </p>
            <CardTitle className="text-1xl text-center text-zinc-500 mb-8 max-h-[60vh] overflow-y-auto">
              Answer: {correctAnswer}
            </CardTitle>
            <Button
              onClick={handleNext}
              disabled={isFlipping}
              className="bg-zinc-500 text-white hover:bg-red-500 mt-auto"
            >
              Next Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  //const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const quizQuery = useQuery({
    queryKey: [`quiz_${id}`],
    queryFn: () => getQuiz(id),
  });

  const cardsQuery = useQuery({
    queryKey: [`cards_${id}`],
    queryFn: () => getCardsByQuizId(id),
  });

  const setCurrentIndexMutation = useMutation({
    mutationFn: (index: number) => setQuizCurrentIndex(id, index),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`quiz_${id}`],
      });
    },
  }).mutate;

  useEffect(() => {
    const data = cardsQuery.data || [];
    if (data.length > 0 && quizQuery.data) generateAnswerOptions(data, quizQuery.data.current_index); // temporary
  }, [cardsQuery.data, quizQuery.data]);

  if (quizQuery.isError || cardsQuery.isError) {
    toast({ description: "Failed to fetch cards" });

    const message = quizQuery.isError
      ? quizQuery.error.message
      : cardsQuery.isError
        ? cardsQuery.error.message
        : "Failed to fetch cards.";

    return <ErrorSkeleton message={message} />;
  }

  if (quizQuery.isPending) {
    return <LoadingSkeleton />;
  }

  if (cardsQuery.isPending) {
    return <SkeletonCard />;
  }

  const quiz = quizQuery.data;
  const cards = cardsQuery.data;
  const currentCardIndex = quizQuery.data.current_index;

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

  const handleSubmit = () => {
    if (selectedAnswer === cards[currentCardIndex].answer) {
      setMessage("Correct!");
    } else {
      setMessage("Incorrect. Try again!");
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const nextIndex = (currentCardIndex + 1) % cards.length;
    setCurrentIndexMutation(nextIndex);
    setSelectedAnswer("");
    setMessage("");
    setIsSubmitted(false);
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <header className="sticky top-0 z-10 bg-transparent flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-gau-pop-magic">
          <span className="text-red-500">QUIZ: </span>
          <span className="text-zinc-500">
            {quiz.course_code} - {quiz.category}
          </span>
        </h1>
        <div className="flex items-center">
          <Button variant="outline" className="mr-2 text-white bg-red-500 hover:bg-zinc-500 hover:text-white">
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard?view=ongoing" className="bg-white-100 hover:bg-zinc-500 text-red-500 hover:text-white">
              Back
            </a>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!cards || cards.length === 0 ? (
          <div className="text-center py-8">No cards available for this course.</div>
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