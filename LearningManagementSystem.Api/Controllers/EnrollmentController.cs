using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Course;
using LearningManagementSystem.Application.Interface;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/Course")]
    [ApiController]
    public class EnrollmentController(ICourseService courseService, IUserService userService) : ControllerBase
    {
        [HttpGet("{id}/User")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var entity = await userService.GetAllByCourseId(id);
            return Ok(entity.Adapt<List<CourseUserResponse>>());
        }

        [HttpPost("{id}/User")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddUser(Guid id, [FromBody] CourseUserRequest request)
        {
            var findUser = await userService.FindById(request.UserId);
            var findCourse = await courseService.GetById(id);
            if (findUser == null || findCourse == null)
            {
                return this.ValidationError("Enrollment", "User or Course not found", StatusCodes.Status404NotFound,
                    "User or Course not found");
            }
        
            bool success = await courseService.CreateEnrollment(findUser, findCourse);
            if (!success)  return this.ValidationError("Enrollment", "User already exist", StatusCodes.Status400BadRequest,
                "User already exist");
            return Ok(new { Message = "User added" });
        }

        [HttpDelete("{id}/User/{userId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> RemoveUser(Guid id, Guid userId)
        {
            var findUser = await userService.FindById(userId);
            var findCourse = await courseService.GetById(id);
            if (findUser == null || findCourse == null)
            {
                return this.ValidationError("Enrollment", "User or Course not found", StatusCodes.Status404NotFound,
                    "User or Course not found");
            }
        
            await courseService.DeleteEnrollment(findUser, findCourse);
        
            return Ok(new  { Message = "User removed" });
        }
    }
}
