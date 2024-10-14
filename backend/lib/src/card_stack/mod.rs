mod postgres_card_stack;

pub use postgres_card_stack::PostgresCardStack;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct Card {
    pub id: Uuid,
    pub question: String,
    pub answer: String,
    pub difficulty: String,
    pub tags: Vec<String>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(
    Serialize, Deserialize, FromRow, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default,
)]
pub struct CreateCard {
    pub question: String,
    pub answer: String,
    pub difficulty: String,
    pub tags: Vec<String>,
}

pub type CardError = String;
pub type CardResult<T> = Result<T, CardError>;

#[async_trait::async_trait]
pub trait CardStack: Send + Sync + 'static {
    async fn get_cards(&self) -> CardResult<Vec<Card>>;
    async fn get_card(&self, card_id: &Uuid) -> CardResult<Card>;
    async fn create_card(&self, create_card: &CreateCard) -> CardResult<Card>;
    async fn update_card(&self, card: &Card) -> CardResult<Card>;
    async fn delete_card(&self, card_id: &Uuid) -> CardResult<Uuid>;
}
