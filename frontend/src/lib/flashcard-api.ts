export interface CardData {
  id: string | "";
  question: string;
  answer: string;
  difficulty: string;
  tags: string[];
  created_at: string | "";
  updated_at: string | "";
}

export async function getAvailableTags(): Promise<string[]> {
  return fetch("http://localhost:8080/api/v1/tags")
    .then((r: Response): Promise<string[]> => r.json())
    .then((data: string[]): string[] => data);
}

export async function getAllCards(): Promise<CardData[]> {
  return fetch("http://localhost:8080/api/v1/cards")
    .then((r: Response): Promise<CardData[]> => r.json())
    .then((data: CardData[]): CardData[] => data);
}

export async function getCard(id: string): Promise<CardData> {
  return fetch(`http://localhost:8080/api/v1/cards/${id}`)
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}

export async function addCard(card: CardData): Promise<CardData> {
  return fetch(`http://localhost:8080/api/v1/cards`, {
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
  return fetch(`http://localhost:8080/api/v1/cards`, {
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
  return fetch(`http://localhost:8080/api/v1/cards/${id}`, { method: "DELETE" })
    .then((r: Response): Promise<CardData> => r.json())
    .then((data: CardData): CardData => data);
}
