import axios from "axios";
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

const address = `http://${process.env.API_HOST || "62.146.233.89"}:${process.env.API_PORT || "1107"}`;

export async function getAvailableTags(): Promise<string[]> {
  return axios.get<TagData>(`${address}/api/v1/tags`).then((r): string[] => r.data.tags);
}

export async function getAllCards(): Promise<CardData[]> {
  return axios.get<CardData[]>(`${address}/api/v1/cards`).then((r): CardData[] => r.data);
}

export async function getCard(id: string): Promise<CardData> {
  return axios.get<CardData>(`${address}/api/v1/cards/${id}`).then((r): CardData => r.data);
}

export async function addCard(card: CardData): Promise<CardData> {
  return axios.post<CardData>(`${address}/api/v1/cards`, { ...card }).then((r): CardData => r.data);
}

export async function updateCard(card: CardData): Promise<CardData> {
  return axios.put<CardData>(`${address}/api/v1/cards`, { ...card }).then((r): CardData => r.data);
}

export async function deleteCard(id: string): Promise<CardData> {
  return axios.delete<CardData>(`${address}/api/v1/cards/${id}`).then((r): CardData => r.data);
}

// todo
export async function getCardsByCourse(course: string): Promise<CardData[]> {
  return axios.get<CardData[]>(`${address}/api/v1/cards/course/${course}`).then((r): CardData[] => r.data);
}
