mod postgres_cards;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use crate::KeikoResult;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Card {
    pub id: Uuid,
    pub question: String,
    pub answer: String,
    pub course_code: String,
    pub category: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CreateCard {
    pub question: String,
    pub answer: String,
    pub course_code: String,
    pub category: String,
}

#[async_trait::async_trait]
pub trait CardAPI: Send + Sync + 'static {
    async fn get_cards(&self) -> KeikoResult<Vec<Card>>;
    async fn get_card(&self, card_id: &Uuid) -> KeikoResult<Card>;
    async fn create_card(&self, create_card: &CreateCard) -> KeikoResult<Card>;
    async fn update_card(&self, card: &Card) -> KeikoResult<Card>;
    async fn delete_card(&self, card_id: &Uuid) -> KeikoResult<Uuid>;
    async fn get_cards_by_course_code(&self, course_code: &String) -> KeikoResult<Vec<Card>>;
}
