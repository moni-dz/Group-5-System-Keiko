use crate::card_api::{Card, CardAPI, CreateCard};
use ntex::web::{
    self,
    types::{Json, Path, State},
    HttpResponse, ServiceConfig,
};
use uuid::Uuid;

pub fn service<S: CardAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/cards")
            .route("", web::get().to(get_cards::<S>))
            .route("/id/{card_id}", web::get().to(get_card::<S>))
            .route("/quiz/{quiz_id}", web::get().to(get_cards_by_quiz_id::<S>))
            .route("", web::post().to(add_card::<S>))
            .route("", web::put().to(update_card::<S>))
            .route("/id/{card_id}", web::delete().to(delete_card::<S>)),
    );
}

/// GET /v1/cards
async fn get_cards<S: CardAPI>(stack: State<S>) -> HttpResponse {
    match stack.get_cards().await {
        Ok(cards) => HttpResponse::Ok().json(&cards),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// GET /v1/cards/id/{card_id}
async fn get_card<S: CardAPI>(card_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.get_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(&card),
        Err(_) => HttpResponse::NotFound().body("Not found"),
    }
}

/// GET /v1/cards/course/{course_code}
async fn get_cards_by_quiz_id<S: CardAPI>(quiz_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.get_cards_by_quiz_id(&quiz_id).await {
        Ok(cards) => HttpResponse::Ok().json(&cards),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

/// POST /v1/cards
async fn add_card<S: CardAPI>(create_card: Json<CreateCard>, stack: State<S>) -> HttpResponse {
    match stack.create_card(&create_card).await {
        Ok(card) => HttpResponse::Ok().json(&card),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

/// PUT /v1/cards
async fn update_card<S: CardAPI>(card: Json<Card>, stack: State<S>) -> HttpResponse {
    match stack.update_card(&card).await {
        Ok(card) => HttpResponse::Ok().json(&card),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// DELETE /v1/cards/id/{card_id}
async fn delete_card<S: CardAPI>(card_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.delete_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(&card),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}
