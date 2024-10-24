"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
import { EditableCard, SkeletonEditableCard } from "@/components/cards";
import { addCard, addQuiz, CardData, deleteCard, getAllCards, renameQuiz, updateCard } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ManagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showQuizName, setShowQuizName] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quizName, setQuizName] = useState("");
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const { data: cards, isPending } = useQuery({
    queryKey: ['cards'],
    queryFn: getAllCards,
  });

  const addCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "id" | "created_at" | "updated_at">) => addCard(card),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({ description: "Card added successfully" });
    },
    onError: (e: Error) => toast({ description: e.message }),
  });

  const updateCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "created_at" | "updated_at">) => updateCard(card),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({ description: "Card updated successfully" });
    },
    onError: (e: Error) => toast({ description: e.message }),
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({ description: "Card deleted successfully" });
    },
    onError: (e: Error) => toast({ description: e.message }),
  });

  const handleNewQuiz = () => {
    setShowQuizName(true);
  };

  const handleEditExisting = () => {
    setShowQuestionForm(true);
  };

  const handleQuizNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = quizName.trim();
    if (name) {
      addQuiz({ category: name, course_code: 'DEMO' });
      setShowQuestionForm(true);
      setShowQuizName(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCardMutation.mutate({ id: editingId, course_code: 'DEMO', ...formData });
      setEditingId(null);
    } else {
      addCardMutation.mutate({ course_code: 'DEMO', ...formData });
    }
    setFormData({ question: "", answer: "" });
  };

  const handleEdit = (card: CardData) => {
    setEditingId(card.id);
    setFormData({ question: card.question, answer: card.answer });
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Button
        className="absolute top-0 right-0 m-4 p-2 rounded-full hover:bg-red-50"
        variant="ghost"
        onClick={() => router.push("/")}
        
      >
        <Home className="w-6 h-6 text-red-500  rounded-sm" />
      </Button>
      <div className="container mx-auto p-4">
  {!showQuizName && !showQuestionForm && (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className='font-xl text-red-500 font-gau-pop-magic'>DO YOU WANT TO CREATE A NEW QUIZ OR EDIT AN EXISTING ONE?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleEditExisting} 
            className="text-zinc-500 bg-white border hover:border-red-500 border-zinc-500 hover:bg-red-500 hover:text-white"
          >
            Edit
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleNewQuiz} 
            className="hover:text-white border hover:border-red-500 hover:bg-red-500 text-zinc-500 bg-white border-zinc-500"
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )}

        {showQuizName && (
          <Card className="max-w-md mx-auto mt-8 border">
            <CardContent className="p-6">
              <form onSubmit={handleQuizNameSubmit}>
                <Label htmlFor="quizName" className="text-zinc-500 block text-center mb-2 font-gau-pop-magic">
                  QUIZ NAME
                </Label>
                <Input
                  id="quizName"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  className="w-full mb-4 text-center"
                  placeholder=""
                  required
                />
                <Button type="submit" className="w-full bg-red-500 hover:bg-zinc-500 text-white">
                  Create Quiz!
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {showQuestionForm && (
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-bold font-gau-pop-magic text-red-500 text-center">
                {quizName || "QUIZ NAME HERE"}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question" className="text-zinc-500">Question</Label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="bg-white text-zinc-500 resize-none w-full p-2 border border-zinc-500 rounded"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="answer" className="text-zinc-500">Answer</Label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="bg-white text-zinc-500 resize-none w-full p-2 border border-zinc-500 rounded"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" className="bg-red-500 text-white hover:bg-zinc-500">
                  {editingId ? "Update" : "Add"} Item
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/courses")}
                  className="bg-red-500 hover:bg-zinc-500 text-white"
                >
                  Back
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonEditableCard key={i} />
                ))
              ) : (
                cards?.map((card) => (
                  <EditableCard
                    key={card.id}
                    card={card}
                    handleEdit={handleEdit}
                    handleDelete={(id) => deleteCardMutation.mutate(id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}