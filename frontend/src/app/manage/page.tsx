"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SkeletonEditableCard } from "@/components/cards";
import { addCard, deleteCard, CardData, getAllCards, updateCard } from "@/lib/api";
import dynamic from "next/dynamic";
import { useTransitionRouter } from "next-view-transitions";

const EditableCard = dynamic(() => import("@/components/cards").then((mod) => mod.EditableCard), {
  loading: () => <SkeletonEditableCard />,
});

export default function ManagePage() {
  type FormData = Omit<CardData, "id" | "created_at" | "updated_at">;

  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
    difficulty: "",
    course_code: "",
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["cards"],
    queryFn: getAllCards,
  });

  const onError = (e: Error) => {
    toast({ description: e.message });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["cards"],
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData): FormData => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      useUpdateCard({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      useAddCard(formData);
    }

    setFormData({ question: "", answer: "", difficulty: "", course_code: "" });
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
        <h1 className="text-2xl font-bold mb-4">Manage Cards</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                className="bg-white"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Input
                className="bg-white"
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                className="bg-white"
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="course_code">Course Code</Label>
              <Input
                className="bg-white"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit">{editingId ? "Update" : "Add"} Item</Button>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </div>
        </form>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3).keys()].map((i: number) => (
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
