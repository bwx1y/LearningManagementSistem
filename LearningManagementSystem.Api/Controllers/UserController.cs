using LearningManagementSystem.Application.DTO.User;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        [HttpGet, Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] Role? role, [FromQuery] string? search)
        {
            var user = await userService.GetAll(role, search);
            
            return Ok(user.Adapt<List<UserResponse>>());
        }
    }
}
