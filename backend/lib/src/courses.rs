use actix_web::{
    web::{self, ServiceConfig},
    HttpResponse,
};
use uuid::Uuid;

use crate::courses_api::{Course, CourseCompletion, CoursesAPI, CreateCourse};

pub fn service<S: CoursesAPI>(cfg: &mut ServiceConfig) {
    cfg.service(
        web::scope("/v1/courses")
            .route("", web::get().to(get_courses::<S>))
            .route("/{course_id}", web::get().to(get_course::<S>))
            .route("", web::post().to(add_course::<S>))
            .route("", web::put().to(update_course::<S>))
            .route("/{course_id}", web::delete().to(delete_course::<S>))
            .route(
                "/{course_id}/completion",
                web::patch().to(mark_course_completion::<S>),
            ),
    );
}

// GET /v1/courses
async fn get_courses<S: CoursesAPI>(stack: web::Data<S>) -> HttpResponse {
    match stack.get_courses().await {
        Ok(courses) => HttpResponse::Ok().json(courses),
        Err(e) => HttpResponse::NotFound().body(format!("Internal server error: {:?}", e)),
    }
}

// GET /v1/courses/{course_id}
async fn get_course<S: CoursesAPI>(
    course_id: web::Path<Uuid>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.get_course(&course_id).await {
        Ok(course) => HttpResponse::Ok().json(course),
        Err(e) => HttpResponse::NotFound().body(format!("Course not found: {:?}", e)),
    }
}

// POST /v1/courses
async fn add_course<S: CoursesAPI>(
    create_course: web::Json<CreateCourse>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.create_course(&create_course).await {
        Ok(course) => HttpResponse::Ok().json(course),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

// PUT /v1/courses
async fn update_course<S: CoursesAPI>(
    course: web::Json<Course>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.update_course(&course).await {
        Ok(course) => HttpResponse::Ok().json(course),
        Err(e) => {
            HttpResponse::InternalServerError().body(format!("Internal server error: {:?}", e))
        }
    }
}

// DELETE /v1/courses/{course_id}
async fn delete_course<S: CoursesAPI>(
    course_id: web::Path<Uuid>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.delete_course(&course_id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => HttpResponse::NotFound().body(format!("Not found: {:?}", e)),
    }
}

// PATCH /v1/courses/{course_id}/completion
async fn mark_course_completion<S: CoursesAPI>(
    course_id: web::Path<Uuid>,
    course: web::Json<CourseCompletion>,
    stack: web::Data<S>,
) -> HttpResponse {
    match stack.mark_course_completion(&course_id, &course).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => HttpResponse::NotFound().body(format!("Not found: {:?}", e)),
    }
}
