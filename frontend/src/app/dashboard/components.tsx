import { Progress } from "@/components/ui/progress";
import { CourseData, QuizData } from "@/lib/api";
import dayjs from "dayjs";
import Link from "next/link";

interface CourseListProps {
  courses: CourseData[];
  course_code: string;
  activeView: string;
}

export function CourseList(props: CourseListProps) {
  const { courses, course_code: selectedCourse, activeView } = props;

  return (
    <ul>
      {courses.map((course) => (
        <Link href={`?view=${activeView}&course=${course.course_code}`} key={course.id}>
          <li
            className={`mb-2 p-2 rounded cursor-pointer ${
              selectedCourse === course.course_code ? "bg-red-100" : "hover:bg-red-100"
            } font-semibold text-zinc-500`}
          >
            {course.course_code}
          </li>
        </Link>
      ))}
    </ul>
  );
}

interface CourseDetailsProps {
  course_code: string;
  courses: CourseData[];
}

export function CourseDetails(props: CourseDetailsProps) {
  const { course_code, courses } = props;
  const course = courses.find((course) => course.course_code === course_code);

  return course === undefined ? (
    <p className="text-zinc-500 italic">✦ select a course to view details...</p>
  ) : (
    <div>
      <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">
        {course.name || "Course Name"}
      </h3>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Course Code:</span> {course.course_code || "N/A"}
      </p>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Description:</span> {course.description || "No description available."}
      </p>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Number of Questions:</span>{" "}
        {course.questions != 0 ? `${course.questions} questions` : "N/A"}
      </p>

      {course.progress !== undefined && (
        <div className="mt-2">
          <p className="text-zinc-500">Progress: {course.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <Progress value={course.progress} indicatorColor="bg-red-500" className="bg-gray-200 h-2.5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface QuizListProps {
  quizzes: QuizData[];
  quizId: string;
  activeView: string;
}

export function QuizList(props: QuizListProps) {
  const { quizzes, quizId, activeView } = props;

  return (
    <ul>
      {quizzes.map((quiz) => (
        <Link href={`?view=${activeView}&quiz=${quiz.id}`} key={quiz.id}>
          <li
            className={`mb-2 p-2 rounded cursor-pointer ${
              quizId === quiz.id ? "bg-red-100" : "hover:bg-red-100"
            } font-semibold text-zinc-500`}
          >
            {quiz.course_code} - {quiz.category}
          </li>
        </Link>
      ))}
    </ul>
  );
}

interface QuizDetailsProps {
  quizId: string;
  quizzes: QuizData[];
}

export function QuizDetails(props: QuizDetailsProps) {
  const { quizId, quizzes } = props;
  const quiz = quizzes.find((quiz) => quiz.id === quizId);

  if (quiz === undefined) {
    return <p className="text-zinc-500 italic">✦ select a course to view details...</p>;
  }

  return (
    <div>
      <h3 className="text-xl italic font-semibold text-red-500 font-gau-pop-magic mb-2">
        {quiz.category || "Quiz Name"}
      </h3>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Course Code:</span> {quiz.course_code || "N/A"}
      </p>

      <p className="text-zinc-500 font-semibold">
        <span className="font-bold">Number of Questions:</span>{" "}
        {quiz.card_count != 0 ? `${quiz.card_count} questions` : "N/A"}
      </p>

      {quiz.progress !== undefined && (
        <div className="mt-2">
          <p className="text-zinc-500">Progress: {quiz.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <Progress value={quiz.progress} indicatorColor="bg-red-500" className="bg-gray-200 h-2.5" />
          </div>
        </div>
      )}
      {quiz.is_completed && (
        <p className="text-zinc-500 italic mt-2">Completed on: {dayjs(quiz.completed_at).format("MM-DD-YYYY")}</p>
      )}
    </div>
  );
}
