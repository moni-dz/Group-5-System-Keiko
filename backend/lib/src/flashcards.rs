use actix_web::{web::{self, ServiceConfig}, HttpResponse};
use crate::card_stack::{Card, CreateCard, CardStack};
use uuid::Uuid;

pub fn service<S: CardStack>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/cards")
            .route("", web::get().to(get_all::<S>))
            .route("/{card_id}", web::get().to(get::<S>))
            .route("", web::post().to(post::<S>))
            .route("", web::put().to(put::<S>))
            .route("/{card_id}", web::delete().to(delete::<S>)),
    );
}

/// Retrieves all cards as a JSON array
async fn get_all<S: CardStack>(stack: web::Data<S>) -> HttpResponse {
    match stack.get_cards().await {
        Ok(cards) => HttpResponse::Ok().json(cards),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e))
    }
}

/// Retrieves a single card based on UUID
async fn get<S: CardStack>(card_id: web::Path<Uuid>, stack: web::Data<S>) -> HttpResponse {
    match stack.get_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(_) => HttpResponse::NotFound().body("Not found")
    }
}

/// Adds a new card to the list of cards
async fn post<S: CardStack>(create_card: web::Json<CreateCard>, stack: web::Data<S>) -> HttpResponse {
    match stack.create_card(&create_card).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
    }
}

/// Updates an existing card
async fn put<S: CardStack>(card: web::Json<Card>, stack: web::Data<S>) -> HttpResponse {
    match stack.update_card(&card).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

/// Deletes a card from the database
async fn delete<S: CardStack>(card_id: web::Path<Uuid>, stack: web::Data<S>) -> HttpResponse {
    match stack.delete_card(&card_id).await {
        Ok(card) => HttpResponse::Ok().json(card),
        Err(e) => HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
    }
}