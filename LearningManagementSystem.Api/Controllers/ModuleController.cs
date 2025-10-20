using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/Course")]
    [ApiController]
    public class ModuleController(IModuleService moduleService, ICourseService courseService) : ControllerBase
    {
        [HttpGet("{id}/Module")]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> GetModule(Guid id)
        {
            var entity = await moduleService.GetAll(id);
            return Ok(entity.Adapt<List<ModuleResponse>>());
        }

        [HttpPost("{id}/Module")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateModule(Guid id, ModuleRequest request)
        {
            var find = await courseService.GetById(id);
            if (find == null)
                return this.ValidationError(
                    key: "Course",
                    message: "Course not found",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Not found"
                );

            foreach (var item in request.Content)
            {
                switch (item.Type)
                {
                    case ContentType.Quiz: 
                        if (item.QuizId == null) return this.ValidationError(
                            key: "QuizId",
                            message: "QuizId is required",
                            statusCode: StatusCodes.Status400BadRequest,
                            title: "Validation Error"
                        );
                        break;
                    case ContentType.Link: 
                        if (item.LinkUrl == null) return this.ValidationError(
                            key: "LinkUrl",
                            message: "LinkUrl is required",
                            statusCode: StatusCodes.Status400BadRequest,
                            title: "Validation Error"
                        );
                        break;
                    case ContentType.Text:
                        if (item.TextContent == null) return this.ValidationError(
                            key: "TextContent",
                            message: "TextContent is required",
                            statusCode: StatusCodes.Status400BadRequest,
                            title: "Validation Error"
                        );
                        break;
                }
            }
            
            var entity = await moduleService.Create(find.Id, request.Adapt<Module>());
            
            return Created("", entity.Adapt<ModuleResponse>());
        }

        [HttpPut("{id}/Module/{moduleId}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateModule(Guid id, Guid moduleId, ModuleUpdateRequest request)
        {
            var find = await moduleService.GetByIdAndByCourseId(courseId: id, moduleId: moduleId);
            if (find == null)
                return this.ValidationError(
                    key: "Module",
                    message: "Module not found",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Not found"
                );

            var entity = await moduleService.Update(find, request);
            
            return Ok(entity.Adapt<ModuleResponse>());
        }
    }
}
