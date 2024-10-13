use actix_files::Files;
use actix_web::web;
use actix_web::web::ServiceConfig;
use shuttle_actix_web::ShuttleActixWeb;
use shuttle_runtime::CustomError;
use sqlx::Executor;

#[shuttle_runtime::main]
async fn actix_web(
    #[shuttle_shared_db::Postgres(
        local_uri = "postgres://postgres@localhost:5432/cs121_flashcards_app"
    )] pool: sqlx::PgPool,
) -> ShuttleActixWeb<impl FnOnce(&mut ServiceConfig) + Send + Clone + 'static> {
    pool.execute(include_str!("../../db/schema.sql"))
        .await
        .map_err(CustomError::new)?;

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

    Ok(config.into())
}
