use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::web::ServiceConfig;
use actix_web::{web, App, HttpServer};
use clap::Parser;
use fern::colors::ColoredLevelConfig;
use sqlx::postgres::PgPoolOptions;
use sqlx::Executor;

#[derive(Parser)]
struct Config {
    #[arg(default_value = "moni")]
    db_pass: String,
    #[arg(default_value = "62.146.233.89")]
    addr: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args = Config::parse();

    let log_colors = ColoredLevelConfig::new()
        .info(fern::colors::Color::Green)
        .warn(fern::colors::Color::Yellow)
        .error(fern::colors::Color::Red)
        .trace(fern::colors::Color::Magenta)
        .debug(fern::colors::Color::Cyan);

    fern::Dispatch::new()
        .format(move |out, message, record| {
            out.finish(format_args!(
                "[{} {}] {}",
                log_colors.color(record.level()),
                record.target(),
                message
            ))
        })
        .level(log::LevelFilter::Trace)
        .chain(std::io::stdout())
        .apply()
        .unwrap_or_else(|e| {
            panic!("Failed to initialize logging: {:?}", e);
        });

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

    let keiko_db = api_lib::KeikoDatabase::new(pool);
    let keiko_db = web::Data::new(keiko_db);

    let config = move |cfg: &mut ServiceConfig| {
        cfg.service(
            web::scope("/api")
                .app_data(keiko_db)
                .configure(api_lib::health::service)
                .configure(api_lib::flashcards::service::<api_lib::KeikoDatabase>)
                .configure(api_lib::courses::service::<api_lib::KeikoDatabase>),
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
