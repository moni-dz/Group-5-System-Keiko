import { LoremIpsum } from "lorem-ipsum";

export interface CardData {
  id: string | "";
  question: string;
  answer: string;
  difficulty: string;
  tags: string[];
  created_at: string | "";
  updated_at: string | "";
}

export interface TagData {
  tags: string[];
}

// For development only
export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const address = `http://${process.env.API_HOST || "localhost"}:${process.env.API_PORT || "7777"}`;

export async function getAvailableTags(): Promise<string[]> {
  return fetch(`${address}/api/v1/tags`)
    .then((r: Response): Promise<TagData> => r.json())
    .then((data: TagData): string[] => data.tags);
}

export async function getAllCards(): Promise<CardData[]> {
  return fetch(`${address}/api/v1/cards`)
    .then((r: Response): Promise<CardData[]> => r.json())
    .then((data: CardData[]): CardData[] => data);
}

export async function getCard(id: string): Promise<CardData> {
  return fetch(`${address}/api/v1/cards/${id}`)
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}

export async function addCard(card: CardData): Promise<CardData> {
  return fetch(`${address}/api/v1/cards`, {
    method: "POST",
    body: JSON.stringify({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      tags: card.tags,
    }),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}

export async function updateCard(card: CardData): Promise<CardData> {
  return fetch(`${address}/api/v1/cards`, {
    method: "PUT",
    body: JSON.stringify({
      id: card.id,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      tags: card.tags,
    }),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}

export async function deleteCard(id: string): Promise<CardData> {
  return fetch(`${address}/api/v1/cards/${id}`, { method: "DELETE" })
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}
