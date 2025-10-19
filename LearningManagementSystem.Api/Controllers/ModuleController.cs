using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Application.Interface;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/Course")]
    [ApiController]
    public class ModuleController(IModuleService moduleService) : ControllerBase
    {
        [HttpGet("{id}/Module")]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> GetModule(Guid id)
        {
            var entity = await moduleService.GetAll(id);
            return Ok(entity.Adapt<List<ModuleResponse>>());
        }
    }
}
