use super::{Card, CardResult, CardsAPI, CreateCard};
use crate::KeikoDatabase;
use uuid::Uuid;

#[async_trait::async_trait]
impl CardsAPI for KeikoDatabase {
    // GET /v1/cards
    async fn get_cards(&self) -> CardResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    // GET /v1/cards/{card_id}
    async fn get_card(&self, card_id: &Uuid) -> CardResult<Card> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards WHERE id = $1")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    // POST /v1/cards
    async fn create_card(&self, create_card: &CreateCard) -> CardResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      INSERT INTO flashcards (question, answer, course_code)
      VALUES ($1, $2, $3)
      RETURNING *
      "#,
        )
        .bind(&create_card.question)
        .bind(&create_card.answer)
        .bind(&create_card.course_code)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // PUT /v1/cards
    async fn update_card(&self, card: &Card) -> CardResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      UPDATE flashcards
      SET question = $2, answer = $3, course_code = $4, updated_at = now()
      WHERE id = $1
      RETURNING *
      "#,
        )
        .bind(card.id)
        .bind(&card.question)
        .bind(&card.answer)
        .bind(&card.course_code)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // DELETE /v1/cards/{card_id}
    async fn delete_card(&self, card_id: &Uuid) -> CardResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM flashcards WHERE id = $1 RETURNING id")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    // GET /v1/cards/course/{course}
    async fn get_cards_by_course_code(&self, course_code: &String) -> CardResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM flashcards WHERE course_code = $1")
            .bind(course_code)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }
}
