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
  const { question, answer, difficulty, course_code } = props;

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
              <p>
                {difficulty} - {course_code}
              </p>
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
  handleDelete: (id: string) => Promise<void>;
}

export function EditableCard(props: EditableCardProps) {
  const { card, handleEdit, handleDelete } = props;

  return (
    <Card key={card.id}>
      <CardHeader>
        <CardTitle>{card.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Answer:</strong> {card.answer}
        </p>
        <p>
          <strong>Difficulty:</strong> {card.difficulty}
        </p>
        <p>
          <strong>Course Code:</strong> {card.course_code}
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={() => handleEdit(card)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(card.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface EditableCourseProps {
  course: CourseData;
  handleEdit: (course: CourseData) => void;
  handleDelete: (id: string) => Promise<void>;
}

export function EditableCourse(props: EditableCourseProps) {
  const { course, handleEdit, handleDelete } = props;

  return (
    <Card key={course.id}>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Course Code:</strong> {course.course_code}
        </p>
        <p>
          <strong>Description:</strong> {course.description}
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={() => handleEdit(course)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(course.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
