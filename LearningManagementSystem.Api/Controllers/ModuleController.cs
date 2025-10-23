using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/Course")]
[ApiController]
public class ModuleController(IModuleService moduleService, ICourseService courseService) : ControllerBase
{
    [HttpGet("{id}/Module")]
    [Authorize(Roles = "Student,Teacher")]
    public async Task<IActionResult> GetModule(Guid id)
    {
        var userId = User.GetUserId();
        var role = User.GetRole();

        var entity = await moduleService.GetAll(id);
        if (role == Role.Teacher) return Ok(entity.Adapt<List<ModuleResponse>>());

        var response = entity.Select(item => new ModuleUserResponse
        {
            Id = item.Id,
            Order = item.Order,
            Title = item.Title,
            Content = item.Content.Select(f =>
            {
                bool done = false;
                switch (f.Type)
                {
                    case ContentType.File:
                        done = f.Answer.Any(a => a.UserId == userId);
                        break;

                    case ContentType.Quiz:
                        done = f.Quiz != null &&
                               f.Quiz.QuizAttempt.Any(a => a.UserId == userId);
                        break;

                    case ContentType.Link:
                    case ContentType.Text:
                        done = false;
                        break;
                }

                return new ModuleContentUserResponse
                {
                    Type = f.Type,
                    Id = f.Id,
                    Order = f.Order,
                    QuizId = f.QuizId,
                    LinkUrl = f.LinkUrl,
                    TextContent = f.TextContent,
                    Done = done
                };
            }).ToList()
        }).ToList();
        return Ok(response);
    }

    [HttpPost("{id}/Module")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> CreateModule(Guid id, ModuleRequest request)
    {
        var find = await courseService.GetById(id);
        if (find == null)
            return this.ValidationError(
                "Course",
                "Course not found",
                StatusCodes.Status404NotFound,
                "Not found"
            );

        foreach (var item in request.Content)
            switch (item.Type)
            {
                case ContentType.Quiz:
                    if (item.QuizId == null)
                        return this.ValidationError(
                            "QuizId",
                            "QuizId is required",
                            StatusCodes.Status400BadRequest,
                            "Validation Error"
                        );
                    break;
                case ContentType.Link:
                    if (item.LinkUrl == null)
                        return this.ValidationError(
                            "LinkUrl",
                            "LinkUrl is required",
                            StatusCodes.Status400BadRequest,
                            "Validation Error"
                        );
                    break;
                case ContentType.Text:
                    if (item.TextContent == null)
                        return this.ValidationError(
                            "TextContent",
                            "TextContent is required",
                            StatusCodes.Status400BadRequest,
                            "Validation Error"
                        );
                    break;
            }

        var entity = await moduleService.Create(find.Id, request.Adapt<Module>());

        return Created("", entity.Adapt<ModuleResponse>());
    }

    [HttpPut("{id}/Module/{moduleId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> UpdateModule(Guid id, Guid moduleId, ModuleUpdateRequest request)
    {
        var find = await moduleService.GetByIdAndByCourseId(id, moduleId);
        if (find == null)
            return this.ValidationError(
                "Module",
                "Module not found",
                StatusCodes.Status404NotFound,
                "Not found"
            );

        var entity = await moduleService.Update(find, request);

        return Ok(entity.Adapt<ModuleResponse>());
    }

    [HttpDelete("{id}/Module/{moduleId}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteModule(Guid id, Guid moduleId)
    {
        var findEntity = await moduleService.GetByIdAndByCourseId(id, moduleId);
        if (findEntity == null)
            return this.ValidationError(
                "Module",
                "Module not found",
                StatusCodes.Status404NotFound,
                "Not found"
            );

        await moduleService.Delete(findEntity);

        return Ok(new
        {
            Message = "Module deleted"
        });
    }
}