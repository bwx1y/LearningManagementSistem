using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Content;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/Course/{course}/Module/{module}")]
    [ApiController]
    [Authorize(Roles = "Teacher")]
    public class ContentController(IContentService content) : ControllerBase
    {
        [HttpPost("Content")]
        public async Task<IActionResult> CreateContent(Guid course, Guid module, [FromBody] ContentRequest req)
        {
            var request = req.Adapt<ModuleContent>();
            request.ModuleId = module;
            
            var entity = await content.Create(request, course);
            
            var response = entity.Adapt<ContentResponse>();
            return Created("", response);
        }

        [HttpDelete("Content/{id}")]
        public async Task<IActionResult> DeleteContent(Guid course, Guid module, Guid id)
        {
            var entity = await content.GetById(course, module, id);
            if (entity == null) return this.ValidationError(
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
}
