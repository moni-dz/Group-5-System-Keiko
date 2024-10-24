use crate::course_api::{Course, CourseAPI, CreateCourse};
use ntex::web::{
    self,
    types::{Json, Path, State},
    HttpResponse, ServiceConfig,
};
use uuid::Uuid;

pub fn service<S: CourseAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/courses")
            .route("", web::get().to(get_courses::<S>))
            .route("/id/{course_id}", web::get().to(get_course::<S>))
            .route(
                "/id/{course_id}/categories",
                web::get().to(get_categories_for_course::<S>),
            )
            .route("", web::post().to(create_course::<S>))
            .route("", web::put().to(update_course::<S>))
            .route("/id/{course_id}", web::delete().to(delete_course::<S>)),
    );
}

// GET /v1/courses
async fn get_courses<S: CourseAPI>(stack: State<S>) -> HttpResponse {
    match stack.get_courses().await {
        Ok(courses) => HttpResponse::Ok().json(&courses),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

// GET /v1/courses/id/{course_id}
async fn get_course<S: CourseAPI>(course_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.get_course(&course_id).await {
        Ok(course) => HttpResponse::Ok().json(&course),
        Err(e) => HttpResponse::NotFound().body(format!("Course not found: {:?}", e)),
    }
}

// GET /v1/courses/id/{course_id}/categories
async fn get_categories_for_course<S: CourseAPI>(
    course_id: Path<Uuid>,
    stack: State<S>,
) -> HttpResponse {
    match stack.get_categories_for_course(&course_id).await {
        Ok(categories) => HttpResponse::Ok().json(&categories),
        Err(e) => HttpResponse::NotFound().body(format!("Course not found: {:?}", e)),
    }
}

// POST /v1/courses
async fn create_course<S: CourseAPI>(
    create_course: Json<CreateCourse>,
    stack: State<S>,
) -> HttpResponse {
    match stack.create_course(&create_course).await {
        Ok(course) => HttpResponse::Ok().json(&course),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

// PUT /v1/courses
async fn update_course<S: CourseAPI>(course: Json<Course>, stack: State<S>) -> HttpResponse {
    match stack.update_course(&course).await {
        Ok(course) => HttpResponse::Ok().json(&course),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

// DELETE /v1/courses/id/{course_id}
async fn delete_course<S: CourseAPI>(course_id: Path<Uuid>, stack: State<S>) -> HttpResponse {
    match stack.delete_course(&course_id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => HttpResponse::NotFound().body(format!("Not found: {:?}", e)),
    }
}
