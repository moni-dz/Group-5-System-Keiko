use clap::Parser;
use fern::colors::ColoredLevelConfig;
use ntex::web::middleware::Logger;
use ntex::web::{self, App, HttpServer, ServiceConfig};
use ntex_cors::Cors;
use routes::{card, course, health, quiz, KeikoDatabase};
use sqlx::postgres::PgPoolOptions;
use sqlx::Executor;

#[derive(Parser)]
struct Config {
    #[arg(default_value = "moni")]
    db_pass: String,
    #[arg(default_value = "62.146.233.89")]
    addr: String,
}

#[ntex::main]
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

    pool.execute(routes::SCHEMA).await.unwrap_or_else(|e| {
        panic!("Failed to initialize schema: {:?}", e);
    });

    let config = move |cfg: &mut ServiceConfig| {
        cfg.service(
            web::scope("/api")
                .state(KeikoDatabase::new(pool))
                .configure(health::service)
                .configure(card::service::<KeikoDatabase>)
                .configure(course::service::<KeikoDatabase>)
                .configure(quiz::service::<KeikoDatabase>),
        );
    };

    HttpServer::new(move || {
        let cors = Cors::default();

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .configure(config.clone())
    })
    .bind(("0.0.0.0", 1107))?
    .run()
    .await
}
