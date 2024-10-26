"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Home, Pen } from "lucide-react";
import { EditableCard, SkeletonEditableCard } from "@/components/cards";
import {
  addCard,
  addQuiz,
  CardData,
  deleteCard,
  getAllCards,
  renameQuiz,
  updateCard,
  getAllQuizzes,
  QuizData,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "@/components/status";
import Link from "next/link";

interface ManagePageProps {
  params: Promise<{
    course_code: string;
  }>;
}

export default function ManagePage(props: ManagePageProps) {
  const { course_code } = use(props.params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // dialog control
  const [showFirstDialog, setShowFirstDialog] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // popover for renaming quiz
  const [openRename, setOpenRename] = useState(false);
  const [newQuizName, setNewQuizName] = useState("");

  const [currentQuiz, setCurrentQuiz] = useState<Pick<QuizData, "course_code" | "category">>({
    course_code,
    category: "",
  });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pick<CardData, "question" | "answer">>({ question: "", answer: "" });

  const { data: quizzes, isPending: isQuizzesPending } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getAllQuizzes,
    initialData: [],
  });

  const {
    data: cards,
    isPending: isCardsPending,
    isLoading: isCardsLoading,
    isFetching: isCardsFetching,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: getAllCards,
    initialData: [],
  });

  const renameQuizMutation = useMutation({
    mutationFn: ({ old_name, new_name }: { old_name: string; new_name: string }) => {
      setCurrentQuiz({ ...currentQuiz, category: new_name });
      return renameQuiz(course_code, old_name, new_name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setCurrentQuiz((prev) => ({ ...prev, category: newQuizName }));
      setNewQuizName("");
      toast({ description: "Quiz renamed successfully" });
    },
    onError: (e: Error) => toast({ description: e.message }),
  }).mutate;

  function cardMutationSuccess() {
    queryClient.invalidateQueries({ queryKey: ["cards"] });
    toast({ description: "Card added successfully" });
  }

  const addCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "id" | "created_at" | "updated_at">) => addCard(card),
    onSuccess: cardMutationSuccess,
    onError: (e: Error) => toast({ description: e.message }),
  }).mutate;

  const updateCardMutation = useMutation({
    mutationFn: (card: Omit<CardData, "created_at" | "updated_at">) => updateCard(card),
    onSuccess: cardMutationSuccess,
    onError: (e: Error) => toast({ description: e.message }),
  }).mutate;

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: cardMutationSuccess,
    onError: (e: Error) => toast({ description: e.message }),
  }).mutate;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateCardMutation({ id: editingId, ...currentQuiz, ...formData });
      setEditingId(null);
    } else {
      addCardMutation({ ...currentQuiz, ...formData });
    }
    setFormData({ question: "", answer: "" });
  }

  function handleEdit(card: CardData) {
    setEditingId(card.id);
    setFormData({ question: card.question, answer: card.answer });
  }

  if (isQuizzesPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Link href="/dashboard?view=courses">
        <Button className="absolute top-0 right-0 m-4 p-2 rounded-full hover:bg-red-50" variant="ghost">
          <Home className="w-6 h-6 text-red-500 rounded-sm" />
        </Button>
      </Link>
      <div className="container mx-auto p-4">
        {/* first dialog */}
        {showFirstDialog && (
          <AlertDialog open={showFirstDialog}>
            <AlertDialogContent>
              <AlertDialogHeader className="mb-10">
                <VisuallyHidden>
                  <AlertDialogTitle>Create a new quiz or edit an existing one?</AlertDialogTitle>
                </VisuallyHidden>
                <AlertDialogDescription className="font-xl text-red-500 font-gau-pop-magic">
                  DO YOU WANT TO CREATE A NEW QUIZ OR EDIT AN EXISTING ONE?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                <AlertDialogAction
                  onClick={() => router.push(`/course/${course_code}`)}
                  className="w-full sm:w-auto text-zinc-500 bg-white border hover:border-red-500 border-zinc-500 hover:bg-red-500 hover:text-white"
                >
                  Back
                </AlertDialogAction>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 w-full sm:w-auto">
                  <AlertDialogAction
                    onClick={() => {
                      setShowFirstDialog(false);
                      setShowEditDialog(true);
                    }}
                    className="w-full sm:w-auto text-zinc-500 bg-white border hover:border-red-500 border-zinc-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!quizzes.some((quiz) => quiz.course_code === course_code)}
                  >
                    {!quizzes.some((quiz) => quiz.course_code === course_code) ? "No quizzes to edit." : "Edit"}
                  </AlertDialogAction>
                  <AlertDialogAction
                    onClick={() => {
                      setShowFirstDialog(false);
                      setShowNewDialog(true);
                    }}
                    className="w-full sm:w-auto hover:text-white border hover:border-red-500 hover:bg-red-500 text-zinc-500 bg-white border-zinc-500"
                  >
                    Create
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Create dialog */}
        {showNewDialog && (
          <AlertDialog open={showNewDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <VisuallyHidden>
                  <AlertDialogTitle>Create a quiz.</AlertDialogTitle>
                </VisuallyHidden>
                <AlertDialogDescription className="font-xl text-red-500 font-gau-pop-magic">
                  CREATE A NEW QUIZ
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                placeholder="Enter quiz name..."
                className="w-full border border-zinc-500 p-2 rounded-sm"
                onChange={(e) => setCurrentQuiz({ course_code, category: e.target.value })}
              />
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  onClick={() => {
                    setShowNewDialog(false);
                    setShowFirstDialog(true);
                  }}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <AlertDialogAction
                  onClick={() => {
                    if (currentQuiz.category) {
                      addQuiz(currentQuiz);
                      setShowNewDialog(false);
                      setShowQuestionForm(true);
                    }
                  }}
                  className="hover:text-white border hover:border-red-500 hover:bg-red-500 text-zinc-500 bg-white border-zinc-500"
                  disabled={!currentQuiz.category}
                >
                  Create Quiz!
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Edit dialog */}
        {showEditDialog && (
          <AlertDialog open={showEditDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <VisuallyHidden>
                  <AlertDialogTitle>Select a quiz to edit.</AlertDialogTitle>
                </VisuallyHidden>
                <AlertDialogDescription className="font-xl text-red-500 font-gau-pop-magic">
                  SELECT A QUIZ TO EDIT
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Select
                value={currentQuiz.category}
                onValueChange={(value) => {
                  const quiz = quizzes.find((q) => q.category === value);
                  if (quiz) {
                    setCurrentQuiz(quiz);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quiz..." />
                </SelectTrigger>
                <SelectContent>
                  {quizzes
                    .filter((quiz) => quiz.course_code === course_code)
                    .map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.category} className="cursor-pointer">
                        {quiz.category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  onClick={() => {
                    setShowEditDialog(false);
                    setShowFirstDialog(true);
                  }}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <AlertDialogAction
                  onClick={() => {
                    if (currentQuiz.category) {
                      setShowEditDialog(false);
                      setShowQuestionForm(true);
                    }
                  }}
                  className="hover:text-white border hover:border-red-500 hover:bg-red-500 text-zinc-500 bg-white border-zinc-500"
                  disabled={!currentQuiz.category}
                >
                  Edit Quiz
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showQuestionForm && (
          <>
            <div className="mb-4 flex items-center justify-center space-x-2">
              <h1 className="text-2xl font-bold font-gau-pop-magic text-red-500">{currentQuiz.category}</h1>
              <Popover open={openRename} onOpenChange={setOpenRename}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-red-50">
                    <Pen className="h-4 w-4 text-red-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="center">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          value={newQuizName}
                          onChange={(e) => setNewQuizName(e.target.value)}
                          placeholder={currentQuiz.category}
                          className="h-9"
                        />
                        <Button
                          onClick={() => {
                            if (newQuizName && newQuizName !== currentQuiz.category) {
                              renameQuizMutation({
                                old_name: currentQuiz.category,
                                new_name: newQuizName,
                              });
                              setCurrentQuiz((prev) => ({
                                ...prev,
                                category: newQuizName,
                              }));
                              setOpenRename(false);
                            }
                          }}
                          disabled={!newQuizName || newQuizName === currentQuiz.category}
                          className="bg-red-500 hover:bg-zinc-500 text-white"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question" className="text-zinc-500">
                    Question
                  </Label>
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
                  <Label htmlFor="answer" className="text-zinc-500">
                    Answer
                  </Label>
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
                <Link href="/courses">
                  <Button type="button" className="bg-red-500 hover:bg-zinc-500 text-white">
                    Back
                  </Button>
                </Link>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isCardsPending || isCardsLoading || isCardsFetching
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonEditableCard key={i} />)
                : cards
                    .filter(
                      (card) => currentQuiz.category == card.category && currentQuiz.course_code == card.course_code,
                    )
                    .map((card) => (
                      <EditableCard
                        key={card.id}
                        card={card}
                        handleEdit={handleEdit}
                        handleDelete={(id) => deleteCardMutation(id)}
                      />
                    ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
