mod postgres_cards;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

pub type CardError = String;
pub type CardResult<T> = Result<T, CardError>;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Card {
    pub id: Uuid,
    pub question: String,
    pub answer: String,
    pub course_code: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CreateCard {
    pub question: String,
    pub answer: String,
    pub course_code: String,
}

#[async_trait::async_trait]
pub trait CardsAPI: Send + Sync + 'static {
    async fn get_cards(&self) -> CardResult<Vec<Card>>;
    async fn get_card(&self, card_id: &Uuid) -> CardResult<Card>;
    async fn create_card(&self, create_card: &CreateCard) -> CardResult<Card>;
    async fn update_card(&self, card: &Card) -> CardResult<Card>;
    async fn delete_card(&self, card_id: &Uuid) -> CardResult<Uuid>;
    async fn get_cards_by_course_code(&self, course_code: &String) -> CardResult<Vec<Card>>;
}
