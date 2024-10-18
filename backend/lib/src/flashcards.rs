use crate::cards_api::{Card, CardsAPI, CreateCard};
use actix_web::{
    web::{self, ServiceConfig},
    HttpResponse,
};
use uuid::Uuid;

pub fn service<S: CardsAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/cards")
            .route("", web::get().to(get_cards::<S>))
            .route("/{card_id}", web::get().to(get_card::<S>))
            .route("", web::post().to(add_card::<S>))
            .route("", web::put().to(update_card::<S>))
            .route("/{card_id}", web::delete().to(delete_card::<S>))
            .route("/course/{course}", web::get().to(get_cards_by_course::<S>)),
    )
    .service(web::scope("/v1/tags").route("", web::get().to(get_available_tags::<S>)));
}

/// Retrieves all cards as a JSON array
/// GET /v1/cards
/// Returns: JSON array of cards
/// [
///     {
///         "id": "<card id>",
///         "question": "<card question>",
///         "answer": "<card answer>",
///         "difficulty": "<card difficulty>",
///         "tags": "<card tags>",
///         "created_at": "<card created at>",
///         "updated_at": "<card updated at>",
///     },
/// ]
async fn get_cards<S: CardsAPI>(stack: web::Data<S>) -> HttpResponse {
    match stack.get_cards().await {
        Ok(cards) => HttpResponse::Ok().json(cards),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// Retrieves a single card based on UUID
/// GET /v1/cards/{card_id}
/// Returns: JSON object with the following fields:
/// {
///     "id": "<card id>",
///     "question": "<card question>",
///     "answer": "<card answer>",
///     "difficulty": "<card difficulty>",
///     "tags": "<card tags>",
///     "created_at": "<card created at>",
///     "updated_at": "<card updated at>",
/// },
async fn get_card<S: CardsAPI>(card_id: web::Path<Uuid>, stack: web::Data<S>) -> HttpResponse {
    match stack.get_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(_) => HttpResponse::NotFound().body("Not found"),
    }
}

/// Adds a new card to the list of cards
/// POST /v1/cards
/// Body: JSON object with the following fields:
/// {
///     "question": "<card question>",
///     "answer": "<card answer>",
///     "difficulty": "<card difficulty>",
///     "tags": "<card tags>"
/// }
async fn add_card<S: CardsAPI>(
    create_card: web::Json<CreateCard>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.create_card(&create_card).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

/// Updates an existing card
/// PUT /v1/cards
/// Body: JSON object with the following fields:
/// {
///     "id": "<card id>",
///     "question": "<card question>",
///     "answer": "<card answer>",
///     "difficulty": "<card difficulty>",
///     "tags": "<card tags>"
/// }
async fn update_card<S: CardsAPI>(card: web::Json<Card>, stack: web::Data<S>) -> HttpResponse {
    match stack.update_card(&card).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// Deletes a card from the database
/// DELETE /v1/cards/{card_id}
async fn delete_card<S: CardsAPI>(card_id: web::Path<Uuid>, stack: web::Data<S>) -> HttpResponse {
    match stack.delete_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

/// Gets all available card tags
/// GET /v1/cards/available_tags
/// Returns: JSON array of tags
/// { tags: ["science", "math", "history"] }
async fn get_available_tags<S: CardsAPI>(stack: web::Data<S>) -> HttpResponse {
    match stack.get_available_tags().await {
        Ok(tags) => HttpResponse::Ok().json(tags),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

/// Retrieves all cards for a specific course
async fn get_cards_by_course<S: CardsAPI>(
    course: web::Path<Uuid>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.get_cards_by_course(&course).await {
        Ok(cards) => HttpResponse::Ok().json(cards),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}
