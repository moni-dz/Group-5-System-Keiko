use sqlx::{PgPool, query_as, query_scalar};
use uuid::Uuid;
use crate::CourseError;
use crate::{Course, CourseResult, CourseCompletion};
use chrono::Utc;

pub struct CourseRepository {
    pool: PgPool,
}

impl CourseRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // POST /v1/courses
    pub async fn create_course(&self, create_course: &Course) -> CourseResult<Course> {
        query_as::<_, Course>(
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
        .map_err(|e| CourseError::DatabaseError(e.to_string()))
    }

    // PUT /v1/courses
    pub async fn update_course(&self, course: &Course) -> CourseResult<Course> {
        query_as::<_, Course>(
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
        .map_err(|e| CourseError::DatabaseError(e.to_string()))
    }

    // DELETE /v1/courses/{course_id}
    pub async fn delete_course(&self, course_id: &Uuid) -> CourseResult<Uuid> {
        query_scalar::<_, Uuid>("DELETE FROM courses WHERE id = $1 RETURNING id")
            .bind(course_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| CourseError::DatabaseError(e.to_string()))
    }

    // PATCH /v1/courses/{course_id}/completion
    pub async fn mark_course_completion(
        &self,
        course_id: &Uuid,
        course: &CourseCompletion,
    ) -> CourseResult<Course> {
        query_as::<_, Course>(
            r#"
            UPDATE courses
            SET is_completed = $2, completion_date = $3, progress = $4, updated_at = now()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(course_id)
        .bind(course.is_completed)
        .bind(if course.is_completed {
            Some(Utc::now())
        } else {
            None
        })
        .bind(if course.is_completed { 100 } else { 0 })
        .fetch_one(&self.pool)
        .await
        .map_err(|e| CourseError::DatabaseError(e.to_string()))
    }
}
