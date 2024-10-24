"use client";

import { SkeletonEditableCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  addCard,
  addQuiz,
  CardData,
  deleteCard,
  getAllCards,
  getAllQuizzes,
  getCardsByQuizId,
  renameQuiz,
  updateCard,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { Home } from "lucide-react";
import { ErrorSkeleton, LoadingSkeleton } from "@/components/status";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  type FormData = { question: string; answer: string };

  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quizName, setQuizName] = useState("");
  const [isQuizNameSet, setIsQuizNameSet] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [`cards-${course_code}`],
    queryFn: () => getAllCards(),
  });

  const cardMutateOnError = (e: Error) => {
    toast({ description: e.message });
  };

  const cardMutateOnSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [`cards-${course_code}`],
    });
  };

  const addCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "id" | "created_at" | "updated_at">) => addCard(card),
    onSuccess: cardMutateOnSuccess,
    onError: cardMutateOnError,
  }).mutate;

  const updateCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "created_at" | "updated_at">) => updateCard(card),
    onSuccess: cardMutateOnSuccess,
    onError: cardMutateOnError,
  }).mutate;

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: cardMutateOnSuccess,
    onError: cardMutateOnError,
  }).mutate;

  const handleQuizNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = quizName.trim();
    if (name.length > 0) {
      addQuiz({ category: name, course_code });
      setIsQuizNameSet(true);
    }
  };

  const handleRename = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget["newQuizName"].value.trim();
    renameQuiz(course_code, quizName, name);
  };

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
      updateCardMutation({ id: editingId, course_code: course_code, ...formData });
      setEditingId(null);
    } else {
      addCardMutation({ course_code: course_code, ...formData });
    }

    setFormData({ question: "", answer: "" });
  };

  const handleEdit = useCallback((card: Omit<CardData, "created_at" | "updated_at">) => {
    setEditingId(card.id);
    setFormData({ ...card });
  }, []);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorSkeleton message={error.message} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        {isQuizNameSet ? (
          <div className="relative mb-4">
            <h1 className="text-2xl font-bold font-gau-pop-magic text-red-500 text-center">{quizName}</h1>
            <div className="absolute top-0 right-4 flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-red-500 hover:bg-zinc-500 text-white">Rename Quiz</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Rename Quiz</h4>
                      <p className="text-sm text-muted-foreground">Enter a new name for the current quiz.</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <form onSubmit={handleRename}>
                          <Label htmlFor="newQuizName">Name</Label>
                          <Input id="newQuizName" defaultValue="100%" className="col-span-2 h-8" />
                        </form>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button className="bg-gray hover:bg-gray" onClick={() => router.push("/")} variant="ghost">
                <Home className="h-5 w-5 text-red-500 bg-gray hover:text-white hover:bg-red-500 rounded-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto mt-8 border-2 border-zinc-500">
            <CardContent className="p-6">
              <form onSubmit={handleQuizNameSubmit}>
                <Label htmlFor="quizName" className="text-zinc-500 block text-center mb-2">
                  Name this quiz
                </Label>
                <Input
                  id="quizName"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  className="w-full mb-4 text-center"
                  placeholder="Enter quiz name"
                  required
                />
                <Button type="submit" className="w-full bg-red-500 hover:bg-zinc-500 text-white">
                  Create Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isQuizNameSet && (
          <>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question" className="text-zinc-500">
                    Question
                  </Label>
                  <textarea
                    className="bg-white text-zinc-500 resize-none overflow-hidden w-full p-2 border border-zinc-500 rounded"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    rows={1}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="answer" className="text-zinc-500">
                    Answer
                  </Label>
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
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" className="bg-red-500 text-white hover:bg-zinc-500">
                  {editingId ? "Update" : "Add"} Item
                </Button>
                <Button onClick={() => router.push("/courses")} className="bg-red-500 hover:bg-zinc-500 text-white">
                  Back
                </Button>
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
                  <EditableCard key={card.id} card={card} handleEdit={handleEdit} handleDelete={deleteCardMutation} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
