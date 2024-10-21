import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CardData, CourseData } from "@/lib/api";
import { Trash2 } from "lucide-react";

const cardGap = 16;
const cardWidth = 500;

export function cardMaxWidth(length: number): string {
  const cardsPerRow = Math.min(length, 4);
  return `${cardsPerRow * cardWidth + (cardsPerRow - 1) * cardGap}px`;
}

export function Flashcard(props: Omit<CardData, "id" | "created_at" | "updated_at">) {
  const { question, answer, course_code } = props;

  return (
    <div className="flashcard min-w-fit w-96 max-w-full h-64 cursor-pointer [perspective:1000px]">
      <input type="checkbox" id={`card-${question}`} className="hidden" />
      <label
        htmlFor={`card-${question}`}
        className="flashcard-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] block"
      >
        {/* Front of the card */}
        <Card
          className="flashcard-front absolute w-full h-full [backface-visibility:hidden]"
          style={{
            flexBasis: `${cardWidth}px`,
          }}
        >
          <CardHeader className="flex flex-col items-center justify-center h-full p-4">
            <CardTitle className="text-2xl mb-4">{question}</CardTitle>
          </CardHeader>
        </Card>

        {/* Back of the card */}
        <Card className="flashcard-back absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <p>Answer</p>
              <p>{course_code}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] text-2xl">{answer}</CardContent>
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
          <CardHeader className={`flex flex-col items-center justify-center h-full p-4`}>
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
  card: CardData;
  handleEdit: (card: CardData) => void;
  handleDelete: (id: string) => void;
}

export function EditableCard(props: EditableCardProps) {
  const { card, handleEdit, handleDelete } = props;

  return (
    <Card key={card.id} className="flex flex-col min-h-[200px] overflow-hidden">
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
        <Button variant="outline" className="mr-2 text-zinc-500 hover:bg-red-500 hover:text-white" onClick={() => handleEdit(card)}>
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
  className?: string; // Accept className as a prop
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
        <Button variant="outline" className="text-zinc-500 hover:bg-red-500 hover:text-white" onClick={() => handleManageCourses(course.course_code)}>
          Manage
        </Button>
        <div className="flex items-center">
          <Button variant="outline" className="mr-2 text-zinc-500 hover:bg-red-500 hover:text-white" onClick={() => handleEdit(course)}>
            Edit
          </Button>
          <Button variant="destructive" className="hover:bg-zinc-500 " onClick={() => handleDelete(course.id)}>
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
