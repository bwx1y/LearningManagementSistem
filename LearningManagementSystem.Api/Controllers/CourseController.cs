using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Course;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseController(ICourseService courseService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var role = User.GetRole();
        var userId = User.GetUserId();

        var courses = role switch
        {
            Role.Student => await courseService.GetAllByStudent(userId),
            Role.Teacher => await courseService.GetAllByTeacher(userId),
            _ => await courseService.GetAll()
        };

        return Ok(courses.Adapt<List<CourseResponse>>());
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var role = User.GetRole();
        var userId = User.GetUserId();

        var find = role switch
        {
            Role.Student => await courseService.GetByIdAndByStudent(id: id, studentId: userId),
            _ => await courseService.GetById(id)
        };

        if (find == null || (role == Role.Teacher && find.TeacherId != userId))
            return this.ValidationError("Course", "Course not found", StatusCodes.Status404NotFound,
                "Course not found");

        return Ok(find.Adapt<CourseResponse>());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CourseRequest request)
    {
        var entity = await courseService.Create(request.Adapt<Course>());

        return Created("", entity.Adapt<CourseResponse>());
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CourseRequest request)
    {
        var find = await courseService.GetById(id);
        if (find == null)
            return this.ValidationError("Course", "Course not found", StatusCodes.Status404NotFound,
                "Course not found");

        var entity = await courseService.Update(request.Adapt(find));

        return Ok(entity.Adapt<CourseResponse>());
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var find = await courseService.GetById(id);
        if (find == null)
            return this.ValidationError("Course", "Course not found", StatusCodes.Status404NotFound,
                "Course not found");

        await courseService.Delete(find);
        return Ok(new { Message = "Course deleted" });
    }
}