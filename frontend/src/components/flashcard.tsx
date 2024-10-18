import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CardData } from "@/lib/api";
import { Trash2 } from "lucide-react";

const cardGap = 16;
const cardWidth = 500;

export function cardMaxWidth(length: number): string {
  const cardsPerRow = Math.min(length, 4);
  return `${cardsPerRow * cardWidth + (cardsPerRow - 1) * cardGap}px`;
}

export default function Flashcard(props: Omit<CardData, "id" | "created_at" | "updated_at">) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { question, answer, difficulty, course } = props;

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="min-w-fit w-96 max-w-full h-64 cursor-pointer [perspective:1000px]" onClick={handleFlip}>
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]`}
        style={{ transform: isFlipped ? "rotateY(180deg)" : "" }}
      >
        {/* Front of the card */}
        <Card
          className="absolute w-full h-full [backface-visibility:hidden]"
          style={{
            flexBasis: `${cardWidth}px`,
          }}
        >
          <CardHeader className="flex flex-col items-center justify-center h-full p-4">
            <CardTitle className="text-2xl mb-4">{question}</CardTitle>
          </CardHeader>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <p>Answer</p>
              <p>
                {difficulty} - {course}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] text-2xl">{answer}</CardContent>
        </Card>
      </div>
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
          <strong>Tags:</strong> {card.tags.join(", ")}
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
