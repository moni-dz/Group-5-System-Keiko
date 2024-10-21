import axios from "axios";
import { LoremIpsum } from "lorem-ipsum";

export interface CardData {
  id: string;
  question: string;
  answer: string;
  course_code: string;
  created_at: string;
  updated_at: string;
}

export interface CourseData {
  id: string;
  name: string;
  course_code: string;
  description: string;
  progress: number;
  questions: number;
  is_completed: boolean;
  completion_date: string;
  created_at: string;
  updated_at: string;
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

const ax = axios.create({
  baseURL: `http://${process.env.API_HOST || "62.146.233.89"}:${process.env.API_PORT || "1107"}`,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export async function getAllCards(): Promise<CardData[]> {
  return ax.get<CardData[]>("/api/v1/cards").then((r): CardData[] => r.data);
}

export async function getCard(id: string): Promise<CardData> {
  return ax.get<CardData>(`/api/v1/cards/id/${id}`).then((r): CardData => r.data);
}

export async function addCard(card: Omit<CardData, "id" | "created_at" | "updated_at">): Promise<CardData> {
  return ax.post<CardData>("/api/v1/cards", { ...card }).then((r): CardData => r.data);
}

export async function updateCard(card: Omit<CardData, "created_at" | "updated_at">): Promise<CardData> {
  return ax.put<CardData>("/api/v1/cards", { ...card }).then((r): CardData => r.data);
}

export async function deleteCard(id: string): Promise<CardData> {
  return ax.delete<CardData>(`/api/v1/cards/id/${id}`).then((r): CardData => r.data);
}

export async function getCardsByCourseCode(course_code: string): Promise<CardData[]> {
  return ax.get<CardData[]>(`/api/v1/cards/course/${course_code}`).then((r): CardData[] => r.data);
}

export async function getAllCourses(): Promise<CourseData[]> {
  return ax.get<CourseData[]>("/api/v1/courses").then((r): CourseData[] => r.data);
}

export async function getCourse(id: string): Promise<CourseData> {
  return ax.get<CourseData>(`/api/v1/courses/${id}`).then((r): CourseData => r.data);
}

export async function addCourse(course: Pick<CourseData, "name" | "course_code" | "description">): Promise<CourseData> {
  return ax.post<CourseData>("/api/v1/courses", { ...course }).then((r): CourseData => r.data);
}

export async function updateCourse(
  course: Pick<CourseData, "id" | "name" | "course_code" | "description">,
): Promise<CourseData> {
  return ax.put<CourseData>("/api/v1/courses", { ...course }).then((r): CourseData => r.data);
}

export async function deleteCourse(id: string): Promise<CourseData> {
  return ax.delete<CourseData>(`/api/v1/courses/${id}`).then((r): CourseData => r.data);
}

export async function markCourseCompletion(id: string, is_completed: boolean): Promise<CourseData> {
  return ax.patch<CourseData>(`/api/v1/courses/${id}/completion`, { is_completed }).then((r): CourseData => r.data);
}
