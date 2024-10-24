mod schema;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use crate::KeikoResult;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct QuizView {
    pub id: Uuid,
    pub course_code: String,
    pub category: String,
    pub current_index: i32,
    pub is_completed: bool,
    pub started_at: chrono::DateTime<chrono::Utc>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
    pub card_count: i64,
    pub progress: i32,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Quiz {
    pub id: Uuid,
    pub course_code: String,
    pub category: String,
    pub current_index: i32,
    pub correct_count: i32,
    pub is_completed: bool,
    pub started_at: chrono::DateTime<chrono::Utc>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CreateQuiz {
    pub course_code: String,
    pub category: String,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct QuizCompletion {
    pub id: Uuid,
    pub is_completed: bool,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct QuizIndex {
    pub current_index: i32,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct QuizCorrectCount {
    pub correct_count: i32,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct RenameQuiz {
    pub old: String,
    pub new: String,
}

#[async_trait::async_trait]
pub trait QuizAPI: Send + Sync + 'static {
    async fn get_quizzes(&self) -> KeikoResult<Vec<QuizView>>;
    async fn get_quiz(&self, quiz_id: &Uuid) -> KeikoResult<QuizView>;
    async fn get_ongoing_quizzes(&self) -> KeikoResult<Vec<QuizView>>;
    async fn get_completed_quizzes(&self) -> KeikoResult<Vec<QuizView>>;
    async fn create_quiz(&self, quiz: &CreateQuiz) -> KeikoResult<Quiz>;
    async fn update_quiz(&self, quiz: &Quiz) -> KeikoResult<Quiz>;
    async fn delete_quiz(&self, quiz_id: &Uuid) -> KeikoResult<Uuid>;
    async fn set_quiz_completion(&self, quiz_completion: &QuizCompletion) -> KeikoResult<Quiz>;
    async fn set_current_index(&self, quiz_id: &Uuid, quiz_index: &QuizIndex) -> KeikoResult<Quiz>;
    async fn set_correct_count(
        &self,
        quiz_id: &Uuid,
        quiz_count: &QuizCorrectCount,
    ) -> KeikoResult<Quiz>;
    async fn rename_quiz(&self, course_code: &String, quiz_rename: &RenameQuiz) -> KeikoResult<()>;
}
