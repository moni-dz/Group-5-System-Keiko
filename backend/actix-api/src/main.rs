use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use actix_web::middleware::Logger;
use actix_web::web::ServiceConfig;
use sqlx::Executor;
use sqlx::postgres::PgPoolOptions;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(r#"postgres://postgres@localhost:5432/cs121_flashcards_app"#)
        .await
        .expect("Failed to open database connection");

    pool.execute(include_str!("../../db/schema.sql"))
        .await
        .expect("Failed to initialize schema");

    let card_stack = api_lib::card_stack::PostgresCardStack::new(pool);
    let card_stack = web::Data::new(card_stack);

    let config = move |cfg: &mut ServiceConfig| {
        cfg.service(
            web::scope("/api")
                .app_data(card_stack)
                .configure(api_lib::health::service)
                .configure(api_lib::flashcards::service::<api_lib::card_stack::PostgresCardStack>)
        );
    };

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .configure(config.clone())
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
