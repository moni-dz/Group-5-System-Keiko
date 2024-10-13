use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[cfg_attr(feature = "backend", derive(FromRow))]
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default)]
pub struct Card {
    pub id: uuid::Uuid,
    pub question: String,
    pub answer: String,
    pub difficulty: String,
    pub tags: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[cfg_attr(feature = "backend", derive(FromRow))]
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Default)]
pub struct CreateCard {
    pub question: String,
    pub answer: String,
    pub difficulty: String,
    pub tags: String,
}