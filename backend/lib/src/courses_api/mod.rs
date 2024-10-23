mod postgres_courses;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use crate::KeikoResult;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CourseView {
    pub id: Uuid,
    pub name: String,
    pub course_code: String,
    pub description: String,
    pub completion_date: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
    pub questions: i64,
    pub progress: i64,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Course {
    pub id: Uuid,
    pub name: String,
    pub course_code: String,
    pub description: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
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

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CourseCategory {
    pub category: String,
}

#[async_trait::async_trait]
pub trait CourseAPI: Send + Sync + 'static {
    async fn get_courses(&self) -> KeikoResult<Vec<CourseView>>;
    async fn get_course(&self, course_id: &Uuid) -> KeikoResult<CourseView>;
    async fn get_categories_for_course(&self, course_id: &Uuid)
        -> KeikoResult<Vec<CourseCategory>>;
    async fn create_course(&self, create_course: &CreateCourse) -> KeikoResult<Course>;
    async fn update_course(&self, course: &Course) -> KeikoResult<Course>;
    async fn delete_course(&self, course_id: &Uuid) -> KeikoResult<Uuid>;
}
