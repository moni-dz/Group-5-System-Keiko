use uuid::Uuid;

use crate::{KeikoDatabase, KeikoResult};

use super::{CreateQuiz, Quiz, QuizAPI, QuizCompletion, QuizView};

#[async_trait::async_trait]
impl QuizAPI for KeikoDatabase {
    /// GET /v1/quiz
    async fn get_quizzes(&self) -> KeikoResult<Vec<QuizView>> {
        sqlx::query_as::<_, QuizView>("SELECT * FROM quizzes_view")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/quiz/id/{quiz_id}
    async fn get_quiz(&self, quiz_id: &Uuid) -> KeikoResult<QuizView> {
        sqlx::query_as::<_, QuizView>("SELECT * FROM quizzes_view WHERE id = $1")
            .bind(quiz_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/quiz/ongoing
    async fn get_ongoing_quizzes(&self) -> KeikoResult<Vec<QuizView>> {
        sqlx::query_as::<_, QuizView>("SELECT * FROM quizzes_view WHERE is_completed IS false")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// GET /v1/quiz/completed
    async fn get_completed_quizzes(&self) -> KeikoResult<Vec<QuizView>> {
        sqlx::query_as::<_, QuizView>("SELECT * FROM quizzes_view WHERE is_completed IS true")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// POST /v1/quiz
    async fn create_quiz(&self, quiz: &CreateQuiz) -> KeikoResult<Quiz> {
        sqlx::query_as::<_, Quiz>(
            r#"
            INSERT INTO quizzes (course_code, category)
            VALUES ($1, $2)
            RETURNING *
            "#,
        )
        .bind(&quiz.course_code)
        .bind(&quiz.category)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// PUT /v1/quiz
    async fn update_quiz(&self, quiz: &Quiz) -> KeikoResult<Quiz> {
        sqlx::query_as::<_, Quiz>(
            r#"
            UPDATE quizzes
            SET current_index = $2, correct_count = $3, is_completed = $4, completed_at = $5
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(&quiz.id)
        .bind(&quiz.current_index)
        .bind(&quiz.correct_count)
        .bind(&quiz.is_completed)
        .bind(if quiz.is_completed {
            Some(chrono::Utc::now())
        } else {
            None
        })
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// DELETE /v1/quiz/id/{quiz_id}
    async fn delete_quiz(&self, quiz_id: &Uuid) -> KeikoResult<Uuid> {
        sqlx::query_scalar::<_, Uuid>("DELETE FROM quizzes WHERE id = $1 RETURNING id")
            .bind(quiz_id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| e.to_string())
    }

    /// PATCH /v1/quiz
    async fn mark_quiz_completion(&self, quiz_completion: &QuizCompletion) -> KeikoResult<Quiz> {
        sqlx::query_as::<_, Quiz>(
            r#"
            UPDATE quizzes
            SET is_completed = $2, completed_at = $3
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(&quiz_completion.id)
        .bind(&quiz_completion.is_completed)
        .bind(if quiz_completion.is_completed {
            Some(chrono::Utc::now())
        } else {
            None
        })
        .bind(chrono::Utc::now())
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.to_string())
    }
}