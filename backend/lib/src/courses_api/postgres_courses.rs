use crate::KeikoDatabase;

use super::{Course, CourseResult, CoursesAPI, CreateCourse};
use uuid::Uuid;

#[async_trait::async_trait]
impl CoursesAPI for KeikoDatabase {
    // GET /v1/courses
    async fn get_courses(&self) -> CourseResult<Vec<Course>> {
        sqlx::query_as::<_, Course>("SELECT * FROM courses")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    // GET /v1/courses/{course_id}
    async fn get_course(&self, course_id: &Uuid) -> CourseResult<Course> {
        sqlx::query_as::<_, Course>("SELECT * FROM courses WHERE id = $1")
            .bind(course_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    // POST /v1/courses
    async fn create_course(&self, create_course: &CreateCourse) -> CourseResult<Course> {
        sqlx::query_as::<_, Course>(
            r#"
            INSERT INTO courses (name, course_code, description)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
        )
        .bind(&create_course.name)
        .bind(&create_course.course_code)
        .bind(&create_course.description)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // PUT /v1/courses
    async fn update_course(&self, course: &Course) -> CourseResult<Course> {
        sqlx::query_as::<_, Course>(
            r#"
            UPDATE courses
            SET name = $2, course_code = $3, description = $4, updated_at = now()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(course.id)
        .bind(&course.name)
        .bind(&course.course_code)
        .bind(&course.description)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // DELETE /v1/courses/{course_id}
    async fn delete_course(&self, course_id: &Uuid) -> CourseResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM courses WHERE id = $1 RETURNING id")
            .bind(course_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }
}
