import axios from "axios";
import { LoremIpsum } from "lorem-ipsum";

export interface CardData {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
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

const address = `http://${process.env.API_HOST || "62.146.233.89"}:${process.env.API_PORT || "1107"}`;

export async function getAllCards(): Promise<CardData[]> {
  return axios.get<CardData[]>(`${address}/api/v1/cards`).then((r): CardData[] => r.data);
}

export async function getCard(id: string): Promise<CardData> {
  return axios.get<CardData>(`${address}/api/v1/cards/id/${id}`).then((r): CardData => r.data);
}

export async function addCard(card: Omit<CardData, "id" | "created_at" | "updated_at">): Promise<CardData> {
  return axios.post<CardData>(`${address}/api/v1/cards`, { ...card }).then((r): CardData => r.data);
}

export async function updateCard(card: Omit<CardData, "created_at" | "updated_at">): Promise<CardData> {
  return axios.put<CardData>(`${address}/api/v1/cards`, { ...card }).then((r): CardData => r.data);
}

export async function deleteCard(id: string): Promise<CardData> {
  return axios.delete<CardData>(`${address}/api/v1/cards/id/${id}`).then((r): CardData => r.data);
}

export async function getCardsByCourseCode(course_code: string): Promise<CardData[]> {
  return axios.get<CardData[]>(`${address}/api/v1/cards/course/${course_code}`).then((r): CardData[] => r.data);
}

export async function getAllCourses(): Promise<CourseData[]> {
  return axios.get<CourseData[]>(`${address}/api/v1/courses`).then((r): CourseData[] => r.data);
}

export async function getCourse(id: string): Promise<CourseData> {
  return axios.get<CourseData>(`${address}/api/v1/courses/${id}`).then((r): CourseData => r.data);
}

export async function addCourse(course: Pick<CourseData, "name" | "course_code" | "description">): Promise<CourseData> {
  return axios.post<CourseData>(`${address}/api/v1/courses`, { ...course }).then((r): CourseData => r.data);
}

export async function updateCourse(
  course: Pick<CourseData, "id" | "name" | "course_code" | "description">,
): Promise<CourseData> {
  return axios.put<CourseData>(`${address}/api/v1/courses`, { ...course }).then((r): CourseData => r.data);
}

export async function deleteCourse(id: string): Promise<CourseData> {
  return axios.delete<CourseData>(`${address}/api/v1/courses/${id}`).then((r): CourseData => r.data);
}
