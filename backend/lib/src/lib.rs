pub mod cards_api;
pub mod courses;
pub mod courses_api;
pub mod flashcards;
pub mod health;

pub struct KeikoDatabase {
    pool: sqlx::PgPool,
}

impl KeikoDatabase {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }
}
