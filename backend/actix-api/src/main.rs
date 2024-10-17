use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::web::ServiceConfig;
use actix_web::{web, App, HttpServer};
use clap::Parser;
use sqlx::postgres::PgPoolOptions;
use sqlx::Executor;

#[derive(Parser)]
struct Config {
    db_pass: String,
    addr: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args = Config::parse();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(
            format!(
                "postgres://postgres:{}@{}:5432/cs121_flashcards_app",
                args.db_pass, args.addr
            )
            .as_str(),
        )
        .await
        .unwrap_or_else(|e| {
            panic!("Failed to initialize database: {:?}", e);
        });

    pool.execute(include_str!("../../db/schema.sql"))
        .await
        .unwrap_or_else(|e| {
            panic!("Failed to initialize schema: {:?}", e);
        });

    let card_stack = api_lib::card_stack::PostgresCardStack::new(pool);
    let card_stack = web::Data::new(card_stack);

    let config = move |cfg: &mut ServiceConfig| {
        cfg.service(
            web::scope("/api")
                .app_data(card_stack)
                .configure(api_lib::health::service)
                .configure(api_lib::flashcards::service::<api_lib::card_stack::PostgresCardStack>),
        );
    };

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .configure(config.clone())
    })
    .bind(("127.0.0.1", 7777))?
    .bind(("0.0.0.0", 1107))?
    .run()
    .await
}
