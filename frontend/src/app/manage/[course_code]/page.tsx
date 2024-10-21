"use client";

import { use, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCard } from "@/components/cards";
import { addCard, deleteCard, CardData, getCardsByCourseCode, updateCard } from "@/lib/api";
import dynamic from "next/dynamic";
import { useTransitionRouter } from "next-view-transitions";

const EditableCard = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCard), {
  loading: () => <SkeletonEditableCard />,
});

interface ManagePageProps {
  params: Promise<{
    course_code: string;
  }>;
}

export default function ManagePage(props: ManagePageProps) {
  const { course_code } = use(props.params);
  type FormData = Omit<CardData, "id" | "course_code" | "created_at" | "updated_at">;

  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [`cards-${course_code}`],
    queryFn: () => getCardsByCourseCode(course_code),
  });

  const onError = (e: Error) => {
    toast({ description: e.message });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [`cards-${course_code}`],
    });
  };

  const useAddCard = useMutation({
    mutationFn: (card: Omit<CardData, "id" | "created_at" | "updated_at">) => addCard(card),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const useUpdateCard = useMutation({
    mutationFn: (card: Omit<CardData, "created_at" | "updated_at">) => updateCard(card),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  const useDeleteCard = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: onSuccess,
    onError: onError,
  }).mutate;

  // Auto-resize logic
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));

    // Auto-resize the textarea
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      useUpdateCard({ id: editingId, course_code: course_code, ...formData });
      setEditingId(null);
    } else {
      useAddCard({ course_code: course_code, ...formData });
    }

    setFormData({ question: "", answer: "" });
  };

  const handleEdit = useCallback((card: Omit<CardData, "created_at" | "updated_at">) => {
    setEditingId(card.id);
    setFormData({ ...card });
  }, []);

  if (isError) {
    toast({ description: error.message });
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {error.message}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 font-gau-pop-magic text-red-500">MANAGE CARDS</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="question" className="text-zinc-500">Question</Label>
              <textarea
                className="bg-white text-zinc-500 resize-none overflow-hidden w-full p-2 border border-zinc-500 rounded"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                rows={1} // Start with a single row, auto-resizes as needed
                required
              />
            </div>
            <div>
              <Label htmlFor="answer" className="text-zinc-500">Answer</Label>
              <textarea
                className="bg-white text-zinc-500 resize-none overflow-hidden w-full p-2 border border-zinc-500 rounded"
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                rows={1}
                required
              />
            </div>
          </div>
          {/* Aligning the buttons to the right */}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" className="bg-red-500 text-white hover:bg-zinc-500">{editingId ? "Update" : "Add"} Item</Button>
            <Button onClick={() => router.push("/courses")} className="bg-red-500 hover:bg-zinc-500 text-white">Back</Button>
          </div>
        </form>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6).keys()].map((i: number) => (
              <SkeletonEditableCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((card: CardData) => (
              <EditableCard key={card.id} card={card} handleEdit={handleEdit} handleDelete={useDeleteCard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
