use ntex::web::{self, HttpResponse, ServiceConfig};

pub fn service(cfg: &mut ServiceConfig) {
    cfg.route("/health", web::get().to(health));
}

async fn health() -> HttpResponse {
    HttpResponse::Ok()
        .set_header("version", "v0.0.1")
        .set_header("status", "alive")
        .finish()
}
