interface AnalyticsPageProps {
  params: Promise<{
    course_code: string;
  }>;
}

export default async function AnalyticsPage(props: AnalyticsPageProps) {
  const { course_code } = await props.params;

  return (
    <div>
      <h1>Analytics for {course_code}</h1>
    </div>
  );
}
