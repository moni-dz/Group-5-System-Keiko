import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface FlashcardProps {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  tags: string[];
}

export default function Flashcard(props: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { question, answer, difficulty, tags } = props;

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="w-96 h-64 cursor-pointer [perspective:1000px]" onClick={handleFlip}>
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]`}
        style={{ transform: isFlipped ? "rotateY(180deg)" : "" }}
      >
        {/* Front of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden]">
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
                {difficulty} - {tags[0]}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px] text-2xl">{answer}</CardContent>
        </Card>
      </div>
    </div>
  );
}
