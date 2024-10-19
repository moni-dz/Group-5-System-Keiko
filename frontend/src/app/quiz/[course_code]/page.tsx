"use client";

import { useState, use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SkeletonCard, cardMaxWidth } from "@/components/cards";
import { CardData, getCardsByCourseCode } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="absolute w-full h-full [backface-visibility:hidden] bg-white">
          <CardHeader>
            <CardTitle
              className={`text-2xl text-center transition-opacity duration-250 ${isFlipping ? "opacity-0" : "opacity-100"}`}
            >
              {question}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`flex flex-col justify-between h-[calc(100%-6rem)] transition-opacity duration-250 ${isFlipping ? "opacity-0" : "opacity-100"}`}
          >
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-2"
            >
              {answerOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-center mt-4">
              <Button onClick={onSubmit} disabled={isSubmitted || !selectedAnswer}>
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white">
          <CardContent
            className={`flex flex-col items-center justify-center h-full transition-opacity duration-250 ${isFlipping ? "opacity-0" : "opacity-100"}`}
          >
            <CardTitle className="text-2xl text-center mb-4">Answer: {correctAnswer}</CardTitle>
            <p className={`text-lg mb-4 ${message === "Correct!" ? "text-green-600" : "text-red-600"}`}>{message}</p>
            <Button onClick={handleNext} disabled={isFlipping}>
              Next Card
            </Button>
          </CardContent>
        </Card>
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
    <div className="bg-gray-50 min-h-screen relative">
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Quiz: {course_code}</h1>
        <Button asChild variant="outline">
          <a href="/dashboard">Go Back</a>
        </Button>
      </header>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
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
