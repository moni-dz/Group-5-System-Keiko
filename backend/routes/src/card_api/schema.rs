use super::{Card, CardAPI, CreateCard, UpdateCard};
use crate::{KeikoDatabase, KeikoResult};
use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
impl CardAPI for KeikoDatabase {
    /// GET /v1/cards
    async fn get_cards(&self) -> KeikoResult<Vec<Card>> {
        sqlx::query_as::<_, Card>("SELECT * FROM cards")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/cards/id/{card_id}
    async fn get_card(&self, card_id: &Uuid) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>("SELECT * FROM cards WHERE id = $1")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// POST /v1/cards
    async fn create_card(&self, create_card: &CreateCard) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      INSERT INTO cards (question, answer, course_code, category)
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
    async fn update_card(&self, update_card: &UpdateCard) -> KeikoResult<Card> {
        sqlx::query_as::<_, Card>(
            r#"
      UPDATE cards
      SET question = $2, answer = $3, course_code = $4, category = $5, updated_at = now()
      WHERE id = $1
      RETURNING *
      "#,
        )
        .bind(update_card.id)
        .bind(&update_card.question)
        .bind(&update_card.answer)
        .bind(&update_card.course_code)
        .bind(&update_card.category)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// DELETE /v1/cards/id/{card_id}
    async fn delete_card(&self, card_id: &Uuid) -> KeikoResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM cards WHERE id = $1 RETURNING id")
            .bind(card_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/cards/quiz/{quiz_id}
    async fn get_cards_by_quiz_id(&self, quiz_id: &Uuid) -> KeikoResult<Vec<Card>> {
        sqlx::query_as::<_, Card>(
            r#"
            SELECT c.*
            FROM cards c
            JOIN quizzes q ON c.course_code = q.course_code AND c.category = q.category
            WHERE q.id = $1;
            "#,
        )
        .bind(quiz_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }
}
