pub mod card;
pub mod cards_api;
pub mod course;
pub mod courses_api;
pub mod health;
pub mod quiz;
pub mod quiz_api;

pub struct KeikoDatabase {
    pool: sqlx::PgPool,
}

impl KeikoDatabase {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }
}

pub type KeikoResult<T> = Result<T, String>;
