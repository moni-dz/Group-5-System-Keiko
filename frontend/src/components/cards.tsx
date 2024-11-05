import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CardData, CourseData } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const cardGap = 16;
const cardWidth = 500;

export function cardMaxWidth(length: number): string {
  const cardsPerRow = Math.min(length, 4);
  return `${cardsPerRow * cardWidth + (cardsPerRow - 1) * cardGap}px`;
}

export function Flashcard(props: Pick<CardData, "question" | "answer">) {
  const { question, answer } = props;

  return (
    <div className="flashcard min-w-fit w-96 max-w-full h-64 cursor-pointer [perspective:1000px]">
      <input type="checkbox" id={`card-${question}`} className="hidden" />
      <label
        htmlFor={`card-${question}`}
        className="flashcard-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] block"
      >
        {/* Front of the card */}
      <Card
        className="flashcard-front absolute w-full h-full max-h-[800px] [backface-visibility:hidden] overflow-hidden"
        style={{
          flexBasis: `${cardWidth}px`,
        }}
      >
        <CardHeader className="flex flex-col items-center justify-center h-full p-4">
          <CardTitle className="text-2xl mb-4">{question}</CardTitle>
        </CardHeader>
      </Card>

      {/* Back of the card */}
      <Card className="flashcard-back absolute w-full h-full flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
        <CardHeader className="flex justify-center items-start h-10">
          <CardTitle>Answer</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-grow items-center justify-center text-2xl text-center -mt-8">
          {answer}
        </CardContent>
      </Card>

      </label>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="min-w-fit w-96 max-w-full h-64 cursor-pointer">
      <div className="relative w-full h-full">
        <Card className="absolute w-full h-full" style={{ flexBasis: `${cardWidth}px` }}>
          <CardHeader className="flex flex-col items-center justify-center h-full p-4">
            <CardTitle>
              <Skeleton className="h-4 w-[250px] mb-5" />
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

interface EditableCardProps {
  card: Omit<CardData, "created_at" | "updated_at">;
  handleEdit: (card: Omit<CardData, "created_at" | "updated_at">) => void;
  handleDelete: (id: string) => void;
}

export function EditableCard(props: EditableCardProps) {
  const { card, handleEdit, handleDelete } = props;

  return (
    <Card
      key={card.id}
      className={cn("flex flex-col h-[250px] overflow-hidden", card.id === "optimistic" && "animate-pulse")}
    >
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold text-zinc-600">{card.question}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <div className="mb-2">
          <strong className="text-sm text-zinc-500">Answer:</strong>
          <p className="text-sm text-zinc-700 italic">{card.answer}</p>
        </div>
      </CardContent>
      <div className="flex justify-end p-4 bg-zinc-100 mt-auto">
        <Button
          variant="outline"
          className="mr-2 text-zinc-500 hover:bg-red-500 hover:text-white"
          onClick={() => handleEdit(card)}
        >
          Edit
        </Button>
        <Button variant="destructive" className="hover:bg-zinc-500" onClick={() => handleDelete(card.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

interface EditableCourseProps {
  course: CourseData;
  handleEdit: (course: CourseData) => void;
  handleDelete: (id: string) => void;
  handleManageCourses: (course_code: string) => void;
  className?: string;
}

export function EditableCourse(props: EditableCourseProps) {
  const { course, handleEdit, handleDelete, handleManageCourses } = props;

  return (
    <Card key={course.id} className="flex flex-col h-[250px] overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold truncate text-zinc-500">{course.name}</CardTitle>
        <p className="text-sm font-medium text-gray-500 truncate">{course.course_code}</p>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <p className="text-sm text-zinc-500 line-clamp-3">{course.description}</p>
      </CardContent>
      <div className="flex justify-between items-center p-4 bg-zinc-100 mt-auto">
        <Button
          variant="outline"
          className="text-zinc-500 hover:bg-red-500 hover:text-white"
          onClick={() => handleManageCourses(course.course_code)}
        >
          Manage Quizzes
        </Button>
        <div className="flex items-center">
          <Button
            variant="outline"
            className="mr-2 text-zinc-500 hover:bg-red-500 hover:text-white"
            onClick={() => handleEdit(course)}
          >
            Edit
          </Button>
          <Button variant="destructive" className="hover:bg-zinc-500" onClick={() => handleDelete(course.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function SkeletonEditableCard() {
  return (
    <Card className="flex flex-col h-[300px] overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <Skeleton className="h-6 w-[80%] mb-2" />
        <Skeleton className="h-6 w-[60%]" />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <div className="mb-2">
          <Skeleton className="h-4 w-[40%] mb-1" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
        <div className="flex justify-between mt-auto">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-[30%]" />
        </div>
      </CardContent>
      <div className="flex justify-end p-4 bg-gray-100 mt-auto">
        <Skeleton className="h-9 w-16 mr-2" />
        <Skeleton className="h-9 w-16" />
      </div>
    </Card>
  );
}

export function SkeletonEditableCourse() {
  return (
    <Card className="flex flex-col h-[250px] overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <Skeleton className="h-6 w-[80%] mb-2" />
        <Skeleton className="h-4 w-[60%]" />
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Skeleton className="h-4 w-[90%] mb-1" />
        <Skeleton className="h-4 w-[85%] mb-1" />
        <Skeleton className="h-4 w-[80%]" />
      </CardContent>
      <div className="flex justify-end p-4 bg-gray-100 mt-auto">
        <Skeleton className="h-9 w-16 mr-2" />
        <Skeleton className="h-9 w-16" />
      </div>
    </Card>
  );
}

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

export function QuizCard({
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
  return (
    <div className="w-full max-w-md mx-auto [perspective:1000px]">
      <div
        className={`relative w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isSubmitted ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute w-full [backface-visibility:hidden]">
          <div className="w-full flex flex-col border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <CardTitle className="text-xl text-center text-zinc-500 mb-4">{question}</CardTitle>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-2 w-full mb-4"
            >
              {answerOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-2 ${
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
              className="bg-zinc-600 text-white hover:bg-red-500 transition-colors"
            >
              SUBMIT ANSWER
            </Button>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="w-full flex flex-col border border-zinc-200 rounded-lg p-6 bg-white shadow-md">
            <p
              className={`text-xl font-bold mb-4 ${
                message === "Correct!" ? "text-red-500" : "text-zinc-500"
              }`}
            >
              {message}
            </p>
            <CardTitle className="text-lg text-center text-zinc-500 mb-4">
              Answer: {correctAnswer}
            </CardTitle>
            <Button onClick={onNext} className="bg-zinc-500 text-white hover:bg-red-500">
              Next Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

