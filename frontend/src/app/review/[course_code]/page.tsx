import { SkeletonCard, cardMaxWidth } from "@/components/flashcard";
import { CardData, getCardsByCourseCode } from "@/lib/api";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Flashcard = dynamic(() => import("@/components/flashcard"), {
  loading: () => <SkeletonCard />,
});

interface ReviewPageProps {
  params: Promise<{
    course_code: string;
  }>;
}

export default async function ReviewPage(props: ReviewPageProps) {
  const { course_code } = await props.params;
  const cards = await getCardsByCourseCode(course_code);

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center mb-5">
          <h1 className="text-3xl font-bold mb-8 mt-10">Flashcards</h1>
          <div className="space-y-4">
            <div className="grid grid-rows-2 gap-5">
              <Button asChild>
                <a href="/dashboard">Go Back</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className="flex flex-wrap justify-center gap-4"
            style={{
              maxWidth: cardMaxWidth(cards.length),
            }}
          >
            {cards.map((card: Omit<CardData, "created_at" | "updated_at">) => (
              <Flashcard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}