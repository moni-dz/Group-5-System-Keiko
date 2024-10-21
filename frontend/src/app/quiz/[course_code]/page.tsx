"use client";

import { useState, use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SkeletonCard, cardMaxWidth } from "@/components/cards";
import { CardData, getCardsByCourseCode } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

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
        className={`relative w-full h-[400px] transition-transform duration-500 [transform-style:preserve-3d] ${
          isSubmitted ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-start border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <CardTitle
              className={`text-2xl text-center text-zinc-500 mb-6 transition-opacity duration-250 ${
                isFlipping ? "opacity-0" : "opacity-100"
              }`}
            >
              {question}
            </CardTitle>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-4 w-full mb-8"
            >
              {answerOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 ${
                    selectedAnswer === option
                      ? "bg-red-100 text-zinc-500 rounded-lg" 
                      : "text-zinc-500"
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className={`${
                      selectedAnswer === option ? "border-zinc-500" : "" 
                    }`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`${
                      selectedAnswer === option ? "text-zinc-700" : "text-zinc-600"
                    }`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={onSubmit}
              disabled={isSubmitted || !selectedAnswer}
              className="bg-zinc-600 text-white hover:bg-red-500 transition-colors font-gau-pop-magic"
            >
              SUBMIT ANSWER
            </Button>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <p className={`text-xl font-gau-pop-magic font-bold mb-4 ${message === "Correct!" ? "text-red-500" : "text-zinc-500"}`}>
              {message}
            </p>
            <CardTitle className="text-1xl text-center text-zinc-500 mb-8">
              Answer: {correctAnswer}
            </CardTitle>
            <Button onClick={handleNext} disabled={isFlipping} className="bg-zinc-500 text-white hover:bg-red-500">
              Next Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


interface QuizPageProps {
  params: Promise<{ course_code: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { course_code } = use(params);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`cards_${course_code}`],
    queryFn: () => getCardsByCourseCode(course_code),
  });

  useEffect(() => {
    if (data && data.length > 0) {
      generateAnswerOptions(data, currentCardIndex);
    }
  }, [data, currentCardIndex]);

  if (isError) {
    toast({ description: "Failed to fetch cards" });
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {error.message}
      </div>
    );
  }

  const cards = data as CardData[];

  const generateAnswerOptions = (allCards: CardData[], currentIndex: number) => {
    const correctAnswer = allCards[currentIndex].answer;
    let options = allCards.map((card) => card.answer);
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
    setCurrentCardIndex(nextIndex);
    setSelectedAnswer("");
    setMessage("");
    setIsSubmitted(false);
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        No cards available for this course
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center relative">
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-gau-pop-magic">
          <span className="text-red-500">QUIZ: </span>
          <span className="text-zinc-500">{course_code}</span>
        </h1>
        <div className="flex items-center">
          {/* Lightbulb Button */}
          <Button variant="outline" className="mr-2 text-white bg-red-500 hover:bg-zinc-500 hover:text-white">
            <Lightbulb className="h-5 w-5" />
          </Button>
          {/* Back Button */}
          <Button asChild variant="outline">
            <a href="/dashboard" className="bg-white-100 hover:bg-zinc-500 text-red-500 hover:text-white"> Back</a>
          </Button>
        </div>
      </header>
      <div className="flex justify-center items-center w-full flex-grow px-4">
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
      </div>
    </div>
  );
}