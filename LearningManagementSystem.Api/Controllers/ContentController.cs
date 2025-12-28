using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Content;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/Course/{course}/Module/{module}")]
[ApiController]
public class ContentController(IContentService content, IContentAnswerService contentAnswerService) : ControllerBase
{
    [HttpGet("Content/{id}/Answer")]
    [Authorize(Roles = "Student,Teacher")]
    public async Task<IActionResult> GetModuleAnswer(Guid course, Guid module, Guid id)
    {
        var userId = User.GetUserId();
        var role = User.GetRole();

        if (role == Role.Student)
        {
            var entity = await contentAnswerService.GetAnswer(course, module, id, userId);
            if (entity == null)
                return this.ValidationError(
                    "Course",
                    "Course not found",
                    StatusCodes.Status404NotFound,
                    "Not found"
                );

            return Ok(entity.Adapt<ContentAnswerResponse>());
        }
        
        var listEntity = await contentAnswerService.GetAllAnswer(course, module, id);

        return Ok(listEntity.Select(item => new ContentAnswerTeacherResponse
        {
            Id = item.Id,
            Email = item.User.Email,
            Name = item.User.Name,
            FileUrl = item.UrlFile
        }).ToList());
    }

    [HttpPost("Content/{id}/Answer")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> AddContent(Guid course, Guid module, Guid id, ContentAnswerRequest request)
    {
        var userId = User.GetUserId();

        var value = request.Adapt<ModuleContentAnswer>();
        value.ModuleContentId = id;
        value.UserId = userId;
        
        var entity = await contentAnswerService.Answer(value);
        
        return Created("", entity.Adapt<ContentAnswerResponse>());
    }

    [HttpPost("Content")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> CreateContent(Guid course, Guid module, [FromBody] ContentRequest req)
    {
        var request = req.Adapt<ModuleContent>();
        request.ModuleId = module;

        var entity = await content.Create(request, course);

        var response = entity.Adapt<ContentResponse>();
        return Created("", response);
    }

    [HttpDelete("Content/{id}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> DeleteContent(Guid course, Guid module, Guid id)
    {
        var entity = await content.GetById(course, module, id);
        if (entity == null)
            return this.ValidationError(
                "Content",
                "Content not found",
                StatusCodes.Status404NotFound,
                "Not found"
            );

        await content.Delete(entity);

        return Ok(new
        {
            Message = "Delete Content"
        });
    }
}