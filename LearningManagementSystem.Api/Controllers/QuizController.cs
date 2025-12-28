using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/Course/{courseId}/Module/{moduleId}/[controller]")]
[ApiController]
public class QuizController(IQuizService quizService) : ControllerBase
{
    [HttpGet("{id}")]
    [Authorize(Roles = "Teacher,Student")]
    public async Task<IActionResult> GetQuiz(Guid id)
    {
        var role = User.GetRole();

        var entity = await quizService.GetOne(id);
        if (entity == null)
            return this.ValidationError(
                title: "Not found",
                message: "Not found",
                key: "Quiz",
                statusCode: StatusCodes.Status404NotFound
            );

        if (role == Role.Student)
        {
            var response = entity.Adapt<QuizUserResponse>();

            var userId = User.GetUserId();

            response.Accepted = await quizService.Accepted(userId, id);

            return Ok(response);
        }

        return Ok(entity.Adapt<QuizTeacherResponse>());
    }

    [HttpGet("{id}/Result")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetResults(Guid id)
    {
        var entity = await quizService.GetOne(id);
        if (entity == null)
            return this.ValidationError(
                title: "Not found",
                message: "Not found",
                key: "Quiz",
                statusCode: StatusCodes.Status404NotFound
            );

        var value = await quizService.GetResult(id);
        
        return Ok(value);
    }

    [HttpPost("{id}/Result")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CreateResult(Guid id, List<QuizResultRequest> req)
    {
        var userId = User.GetUserId();
        
        var entity = await quizService.GetOne(id);
        if (entity == null)
            return this.ValidationError(
                title: "Not found",
                message: "Not found",
                key: "Quiz",
                statusCode: StatusCodes.Status404NotFound
            );

        await quizService.CreateResult(userId, id, req);
        
        return Ok(new
        {
            Message = "Success",
        });
    }
    
    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> CreateQuiz(QuizRequest req, Guid courseId, Guid moduleId)
    {
        var entity = await quizService.Create(req, moduleId, courseId);

        return Created("", entity.Adapt<QuizTeacherResponse>());
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> UpdateQuiz(Guid id, QuizUpdateRequest req)
    {
        var entity = await quizService.GetOne(id);
        if (entity == null)
            return this.ValidationError(
                title: "Not found",
                message: "Quiz not found",
                key: "Quiz",
                statusCode: StatusCodes.Status404NotFound
            );
        await quizService.Update(id, req);
        return Ok(entity.Adapt<QuizTeacherResponse>());
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteQuiz(Guid id)
    {
        var entity = await quizService.GetOne(id);
        if (entity == null)
            return this.ValidationError(
                title: "Not found",
                message: "Not found",
                key: "Quiz",
                statusCode: StatusCodes.Status404NotFound
            );

        await quizService.Delete(entity);

        return Ok(new { Message = "Success delete" });
    }
}