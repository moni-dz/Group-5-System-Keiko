use crate::{KeikoDatabase, KeikoResult};

use super::{Course, CourseAPI, CourseCategory, CourseView, CreateCourse};
use uuid::Uuid;

#[async_trait::async_trait]
impl CourseAPI for KeikoDatabase {
    /// GET /v1/courses
    async fn get_courses(&self) -> KeikoResult<Vec<CourseView>> {
        sqlx::query_as::<_, CourseView>("SELECT * FROM courses_view")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/courses/id/{course_id}
    async fn get_course(&self, course_id: &Uuid) -> KeikoResult<CourseView> {
        sqlx::query_as::<_, CourseView>("SELECT * FROM courses_view WHERE id = $1")
            .bind(course_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/courses/code/{course_code}
    async fn get_course_from_course_code(&self, course_code: &String) -> KeikoResult<CourseView> {
        sqlx::query_as::<_, CourseView>("SELECT * FROM courses_view WHERE course_code = $1")
            .bind(course_code)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/courses/id/{course_id}/categories
    async fn get_categories_for_course(
        &self,
        course_id: &Uuid,
    ) -> KeikoResult<Vec<CourseCategory>> {
        sqlx::query_as::<_, CourseCategory>(
            r#"
            SELECT DISTINCT cards.category
            FROM courses_view
            JOIN cards ON courses_view.course_code = cards.course_code
            WHERE courses_view.id = $1
            ORDER BY cards.category;
            "#,
        )
        .bind(course_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// POST /v1/courses
    async fn create_course(&self, create_course: &CreateCourse) -> KeikoResult<Course> {
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

    /// PUT /v1/courses
    async fn update_course(&self, course: &Course) -> KeikoResult<Course> {
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

    /// DELETE /v1/courses/id/{course_id}
    async fn delete_course(&self, course_id: &Uuid) -> KeikoResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM courses WHERE id = $1 RETURNING id")
            .bind(course_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }
}
