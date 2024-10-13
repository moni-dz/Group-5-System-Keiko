"use client";

import { useEffect, useState } from "react";
import Flashcard, {FlashcardProps} from "@/components/flashcard";


export default function ReviewPage() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/cards')
            .then(r => r.json())
            .then(data => {
                setCards(data);
                console.log(data);
            })
    }, []);

    return <>
        <div className="flex flex-row gap-5 items-center justify-center min-h-screen">
            {cards.map((card: FlashcardProps) => <Flashcard key={card.id} {...card} />)}
        </div>
    </>
}