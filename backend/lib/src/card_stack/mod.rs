mod postgres_card_stack;

pub use postgres_card_stack::PostgresCardStack;

use uuid::Uuid;
use shared::models::{Card, CreateCard};

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