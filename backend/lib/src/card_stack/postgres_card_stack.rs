use std::collections::HashSet;

use super::{Card, CardResult, CardStack, CreateCard, Tags};
use uuid::Uuid;

pub struct PostgresCardStack {
    pool: sqlx::PgPool,
}

impl PostgresCardStack {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl CardStack for PostgresCardStack {
    async fn get_cards(&self) -> CardResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    async fn get_card(&self, card_id: &Uuid) -> CardResult<Card> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards WHERE id = $1")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    async fn create_card(&self, create_card: &CreateCard) -> CardResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      INSERT INTO flashcards (question, answer, difficulty, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING id, question, answer, difficulty, tags, created_at, updated_at
      "#,
        )
        .bind(&create_card.question)
        .bind(&create_card.answer)
        .bind(&create_card.difficulty)
        .bind(&create_card.tags)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    async fn update_card(&self, card: &Card) -> CardResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      UPDATE flashcards
      SET question = $2, answer = $3, difficulty = $4, tags = $5, updated_at = now()
      WHERE id = $1
      RETURNING id, question, answer, difficulty, tags, created_at, updated_at
      "#,
        )
        .bind(card.id)
        .bind(&card.question)
        .bind(&card.answer)
        .bind(&card.difficulty)
        .bind(&card.tags)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    async fn delete_card(&self, card_id: &Uuid) -> CardResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>(
            r#"
      DELETE FROM flashcards
      WHERE id = $1
      RETURNING id
      "#,
        )
        .bind(card_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    async fn get_available_tags(&self) -> CardResult<Tags> {
        let cards = self.get_cards().await?;

        let mut tags: HashSet<String> = HashSet::new();
        let mut vecs: Vec<Vec<String>> = Vec::with_capacity(20000);

        cards.into_iter().for_each(|card| {
            vecs.push(card.tags);
        });

        vecs.concat().into_iter().for_each(|tag| {
            tags.insert(tag);
        });

        Ok(Tags {
            tags: tags.into_iter().collect(),
        })
    }
}
