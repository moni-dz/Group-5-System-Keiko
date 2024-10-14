"use client";

import { useEffect, useState } from "react";
import Flashcard, { FlashcardProps } from "@/components/flashcard";
import { CardData, getAllCards } from "@/lib/flashcard-api";
import { Button } from "@/components/ui/button";

export default function ReviewPage() {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    getAllCards().then((data: CardData[]) => setCards(data));
  }, []);

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center -mb-40">
          <h1 className="text-3xl font-bold mb-8 mt-10">Flashcards</h1>
          <div className="space-y-4">
            <div className="flex gap-5">
              <Button className="w-64" asChild>
                <a href="/">Go Back</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-5 items-center justify-center min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center">
            {cards.map((card: FlashcardProps) => (
              <Flashcard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
