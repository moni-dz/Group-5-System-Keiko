"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { addCard, deleteCard, CardData, getAllCards, updateCard } from "@/lib/flashcard-api";

export default function CardManagement() {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    difficulty: "",
    tags: "",
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getAllCards();
      setCards(data);
    };

    fetchData().catch(() => setError("Failed to fetch data."));
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const updatedCard = await updateCard({
          id: editingId,
          question: formData.question,
          answer: formData.answer,
          difficulty: formData.difficulty,
          tags: formData.tags.split(","),
        } as CardData);

        setCards(cards.map((card: CardData): CardData => (card.id === editingId ? updatedCard : card)));
        setEditingId(null);

        if (!error) {
          toast({ description: "Card successfully edited." });
        }
      } else {
        const card: CardData = await addCard({
          question: formData.question,
          answer: formData.answer,
          difficulty: formData.difficulty,
          tags: formData.tags.split(","),
        } as CardData);

        setCards([...cards, card]);

        if (!error) {
          toast({ description: "Card added." });
        }
      }

      setFormData({ question: "", answer: "", difficulty: "", tags: "" });
    } catch (err) {
      setError("Failed to save item.");

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: CardData) => {
    setEditingId(card.id);
    setFormData({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      tags: card.tags.join(","),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteCard(id);
      setCards(cards.filter((card: CardData): boolean => card.id !== id));
    } catch {
      setError("Failed to delete item.");
    } finally {
      setLoading(false);

      if (!error) {
        toast({ description: "Card deleted." });
      }
    }
  };

  if (error) {
    toast({ description: error });
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
              <Label htmlFor="tags">Tags</Label>
              <Input
                className="bg-white"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingId ? "Update" : "Add"} Item
            </Button>
            <Button asChild>
              <a href="/">Go Back</a>
            </Button>
          </div>
        </form>

        {loading && !cards.length ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card: CardData) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>{card.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Answer:</strong> {card.answer}
                  </p>
                  <p>
                    <strong>Difficulty:</strong> {card.difficulty}
                  </p>
                  <p>
                    <strong>Tags:</strong> {card.tags.join(", ")}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(card)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(card.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
