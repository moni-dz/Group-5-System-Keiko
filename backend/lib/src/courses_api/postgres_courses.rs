use crate::KeikoDatabase;

use super::{Course, CourseResult, CoursesAPI, CreateCourse};
use uuid::Uuid;

#[async_trait::async_trait]
impl CoursesAPI for KeikoDatabase {
    // GET /v1/courses
    async fn get_courses(&self) -> CourseResult<Vec<Course>> {
        todo!()
    }

    // GET /v1/courses/{course_id}
    async fn get_course(&self, course_id: &Uuid) -> CourseResult<Course> {
        todo!()
    }

    // POST /v1/courses
    async fn create_course(&self, create_course: &CreateCourse) -> CourseResult<Course> {
        todo!()
    }

    // PUT /v1/courses
    async fn update_course(&self, course: &Course) -> CourseResult<Course> {
        todo!()
    }

    // DELETE /v1/courses/{course_id}
    async fn delete_course(&self, course_id: &Uuid) -> CourseResult<Uuid> {
        todo!()
    }
}
