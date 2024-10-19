mod postgres_courses;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

pub type CourseError = String;
pub type CourseResult<T> = Result<T, CourseError>;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Course {
    pub id: Uuid,
    pub name: String,
    pub course_code: String,
    pub description: String,
    pub progress: i32,
    pub is_completed: bool,
    pub completion_date: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CreateCourse {
    pub name: String,
    pub course_code: String,
    pub description: String,
}

#[async_trait::async_trait]
pub trait CoursesAPI: Send + Sync + 'static {
    async fn get_courses(&self) -> CourseResult<Vec<Course>>;
    async fn get_course(&self, course_id: &Uuid) -> CourseResult<Course>;
    async fn create_course(&self, create_course: &CreateCourse) -> CourseResult<Course>;
    async fn update_course(&self, course: &Course) -> CourseResult<Course>;
    async fn delete_course(&self, course_id: &Uuid) -> CourseResult<Uuid>;
}
