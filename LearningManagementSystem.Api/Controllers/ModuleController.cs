using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
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
            
            var entity = await moduleService.Create(find.Id, request.Adapt<Module>());
            
            return Created("", entity.Adapt<ModuleResponse>());
        }

        
    }
}
