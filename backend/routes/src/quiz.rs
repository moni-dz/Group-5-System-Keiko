use ntex::web::{
    self,
    types::{Json, Path, State},
    HttpResponse, ServiceConfig,
};
use uuid::Uuid;

use crate::quiz_api::{
    CreateQuiz, Quiz, QuizAPI, QuizCompletion, QuizCorrectCount, QuizHint, QuizIndex, RenameQuiz,
};

pub fn service<S: QuizAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/quiz")
            .route("", web::get().to(get_quizzes::<S>))
            .route("/id/{quiz_id}", web::get().to(get_quiz::<S>))
            .route("/ongoing", web::get().to(get_ongoing_quizzes::<S>))
            .route("/completed", web::get().to(get_completed_quizzes::<S>))
            .route("", web::post().to(create_quiz::<S>))
            .route("", web::put().to(update_quiz::<S>))
            .route("/id/{quiz_id}", web::delete().to(delete_quiz::<S>))
            .route("", web::patch().to(set_quiz_completion::<S>))
            .route(
                "/id/{quiz_id}/index",
                web::patch().to(set_current_index::<S>),
            )
            .route(
                "/id/{quiz_id}/correct",
                web::patch().to(set_correct_count::<S>),
            )
            .route("/id/{quiz_id}/hint", web::patch().to(set_hint_used::<S>))
            .route("/rename/{course_code}", web::post().to(rename_quiz::<S>)),
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

/// PATCH /v1/quiz
async fn set_quiz_completion<S: QuizAPI>(
    quiz_completion: Json<QuizCompletion>,
    stack: State<S>,
) -> HttpResponse {
    match stack.set_quiz_completion(&quiz_completion).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// PATCH /v1/quiz/id/{quiz_id}/index
async fn set_current_index<S: QuizAPI>(
    quiz_id: Path<Uuid>,
    quiz_index: Json<QuizIndex>,
    stack: State<S>,
) -> HttpResponse {
    match stack.set_current_index(&quiz_id, &quiz_index).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// PATCH /v1/quiz/id/{quiz_id}/correct
async fn set_correct_count<S: QuizAPI>(
    quiz_id: Path<Uuid>,
    quiz_correct: Json<QuizCorrectCount>,
    stack: State<S>,
) -> HttpResponse {
    match stack.set_correct_count(&quiz_id, &quiz_correct).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// PATCH /v1/quiz/id/{quiz_id}/hint
async fn set_hint_used<S: QuizAPI>(
    quiz_id: Path<Uuid>,
    quiz_hint: Json<QuizHint>,
    stack: State<S>,
) -> HttpResponse {
    match stack.set_hint_used(&quiz_id, &quiz_hint).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// POST /v1/quiz/rename/{course_code}
async fn rename_quiz<S: QuizAPI>(
    course_code: Path<String>,
    rename_quiz: Json<RenameQuiz>,
    stack: State<S>,
) -> HttpResponse {
    match stack.rename_quiz(&course_code, &rename_quiz).await {
        Ok(quiz) => HttpResponse::Ok().json(&quiz),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}
