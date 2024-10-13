import { useState } from 'react'
import { Card } from "@/components/ui/card"
export interface FlashcardProps {
    id: string,
    question: string,
    answer: string,
    difficulty: string,
    tags: string
}

export default function Flashcard(props: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const { question, answer, difficulty, tags } = props

    const handleFlip = () => setIsFlipped(!isFlipped)

    return (
        <div
            className="w-96 h-64 cursor-pointer [perspective:1000px]"
            onClick={handleFlip}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]`}
                style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}
            >
                {/* Front of the card */}
                <Card className="absolute w-full h-full [backface-visibility:hidden]">
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">{question}</h2>
                    </div>
                </Card>

                {/* Back of the card */}
                <Card
                    className="absolute w-full h-full [backface-visibility:hidden]"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <p className="text-2xl">{answer}</p>
                        <p className="absolute top-3 left-3 text-sm font-medium">Answer</p>
                        <p className="absolute top-3 right-3 text-sm font-medium">
                            {difficulty} - {tags}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}