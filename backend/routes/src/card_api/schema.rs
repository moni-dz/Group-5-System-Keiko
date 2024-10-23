use super::{Card, CardAPI, CreateCard};
use crate::{KeikoDatabase, KeikoResult};
use uuid::Uuid;

#[async_trait::async_trait]
impl CardAPI for KeikoDatabase {
    /// GET /v1/cards
    async fn get_cards(&self) -> KeikoResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/cards/id/{card_id}
    async fn get_card(&self, card_id: &Uuid) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards WHERE id = $1")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// POST /v1/cards
    async fn create_card(&self, create_card: &CreateCard) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      INSERT INTO flashcards (question, answer, course_code, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      "#,
        )
        .bind(&create_card.question)
        .bind(&create_card.answer)
        .bind(&create_card.course_code)
        .bind(&create_card.category)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// PUT /v1/cards
    async fn update_card(&self, card: &Card) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      UPDATE flashcards
      SET question = $2, answer = $3, course_code = $4, category = $5, updated_at = now()
      WHERE id = $1
      RETURNING *
      "#,
        )
        .bind(&card.id)
        .bind(&card.question)
        .bind(&card.answer)
        .bind(&card.course_code)
        .bind(&card.category)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// DELETE /v1/cards/id/{card_id}
    async fn delete_card(&self, card_id: &Uuid) -> KeikoResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM flashcards WHERE id = $1 RETURNING id")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/cards/course/{course}
    async fn get_cards_by_course_code(&self, course_code: &String) -> KeikoResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards WHERE course_code = $1")
            .bind(course_code)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }
}
