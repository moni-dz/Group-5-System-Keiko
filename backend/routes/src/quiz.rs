use ntex::web::{
    self,
    types::{Json, Path, State},
    HttpResponse, ServiceConfig,
};
use uuid::Uuid;

use crate::quiz_api::{CreateQuiz, Quiz, QuizAPI};

pub fn service<S: QuizAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/quiz")
            .route("", web::get().to(get_quizzes::<S>))
            .route("/id/{quiz_id}", web::get().to(get_quiz::<S>))
            .route("/ongoing", web::get().to(get_ongoing_quizzes::<S>))
            .route("/completed", web::get().to(get_completed_quizzes::<S>))
            .route("", web::post().to(create_quiz::<S>))
            .route("", web::put().to(update_quiz::<S>))
            .route("/id/{quiz_id}", web::delete().to(delete_quiz::<S>)),
    );
}

/// GET /v1/quiz
async fn get_quizzes<S: QuizAPI>(stack: State<S>) -> HttpResponse {
    match stack.get_quizzes().await {
        Ok(quizzes) => HttpResponse::Ok().json(&quizzes),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// GET /v1/quiz/id/{quiz_id}
async fn get_quiz<S: QuizAPI>(quiz_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.get_quiz(&quiz_id).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Quiz not found: {:?}", e)),
    }
}

/// GET /v1/quiz/ongoing
async fn get_ongoing_quizzes<S: QuizAPI>(stack: State<S>) -> HttpResponse {
    match stack.get_ongoing_quizzes().await {
        Ok(quizzes) => HttpResponse::Ok().json(&quizzes),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// GET /v1/quiz/completed
async fn get_completed_quizzes<S: QuizAPI>(stack: State<S>) -> HttpResponse {
    match stack.get_completed_quizzes().await {
        Ok(quizzes) => HttpResponse::Ok().json(&quizzes),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// POST /v1/quiz
async fn create_quiz<S: QuizAPI>(create_quiz: Json<CreateQuiz>, stack: State<S>) -> HttpResponse {
    match stack.create_quiz(&create_quiz).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// PUT /v1/quiz
async fn update_quiz<S: QuizAPI>(quiz: Json<Quiz>, stack: State<S>) -> HttpResponse {
    match stack.update_quiz(&quiz).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// DELETE /v1/quiz/id/{quiz_id}
async fn delete_quiz<S: QuizAPI>(quiz_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.delete_quiz(&quiz_id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => HttpResponse::NotFound().body(format!("Quiz not found: {:?}", e)),
    }
}
