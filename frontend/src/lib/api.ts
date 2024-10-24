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
  completion_date: string;
  created_at: string;
  updated_at: string;
  questions: number;
  progress: number;
}

export interface QuizData {
  id: string;
  course_code: string;
  category: string;
  current_index: number;
  correct_count: number;
  is_completed: boolean;
  started_at: string;
  completed_at: string;
  card_count: number;
  progress: number;
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

// 62.146.233.89
//
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

export async function getCardsByQuizId(quiz_id: string): Promise<CardData[]> {
  return ax.get<CardData[]>(`/api/v1/cards/quiz/${quiz_id}`).then((r): CardData[] => r.data);
}

export async function getAllCourses(): Promise<CourseData[]> {
  return ax.get<CourseData[]>("/api/v1/courses").then((r): CourseData[] => r.data);
}

export async function getCourse(id: string): Promise<CourseData> {
  return ax.get<CourseData>(`/api/v1/courses/id/${id}`).then((r): CourseData => r.data);
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
  return ax.delete<CourseData>(`/api/v1/courses/id/${id}`).then((r): CourseData => r.data);
}

export async function getAllQuizzes(): Promise<QuizData[]> {
  return ax.get<QuizData[]>("/api/v1/quiz").then((r): QuizData[] => r.data);
}

export async function getQuiz(id: string): Promise<QuizData> {
  return ax.get<QuizData>(`/api/v1/quiz/id/${id}`).then((r): QuizData => r.data);
}

export async function getOngoingQuizzes(): Promise<QuizData[]> {
  return ax.get<QuizData[]>("/api/v1/quiz/ongoing").then((r): QuizData[] => r.data);
}

export async function getCompletedQuizzes(): Promise<QuizData[]> {
  return ax.get<QuizData[]>("/api/v1/quiz/completed").then((r): QuizData[] => r.data);
}

export async function addQuiz(quiz: Pick<QuizData, "course_code" | "category">): Promise<QuizData> {
  return ax.post<QuizData>("/api/v1/quiz", { ...quiz }).then((r): QuizData => r.data);
}

export async function updateQuiz(
  quiz: Pick<QuizData, "id" | "current_index" | "correct_count" | "is_completed">,
): Promise<QuizData> {
  return ax.put<QuizData>("/api/v1/quiz", { ...quiz }).then((r): QuizData => r.data);
}

export async function deleteQuiz(id: string): Promise<QuizData> {
  return ax.delete<QuizData>(`/api/v1/quiz/id/${id}`).then((r): QuizData => r.data);
}

export async function setQuizCompletion(id: string, is_completed: boolean): Promise<QuizData> {
  return ax.patch<QuizData>("/api/v1/quiz", { id, is_completed }).then((r): QuizData => r.data);
}

export async function setQuizCurrentIndex(id: string, index: number): Promise<QuizData> {
  return ax.patch<QuizData>(`/api/v1/quiz/id/${id}/index`, { current_index: index }).then((r): QuizData => r.data);
}

export async function setQuizCorrectCount(id: string, count: number): Promise<QuizData> {
  return ax.patch<QuizData>(`/api/v1/quiz/id/${id}/correct`, { correct_count: count }).then((r): QuizData => r.data);
}

export async function renameQuiz(course_code: string, old_name: string, new_name: string) {
  return ax.post<void>(`/api/v1/quiz/rename/${course_code}`, { old: old_name, new: new_name }).then((r) => {});
}
