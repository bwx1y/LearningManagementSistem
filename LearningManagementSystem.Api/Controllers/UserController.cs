using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.User;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] Role? role, [FromQuery] string? search)
    {
        var user = await userService.GetAll(role, search);

        return Ok(user.Adapt<List<UserResponse>>());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] UserRequest request)
    {
        if (request.ConfirmPassword != request.Password)
            return this.ValidationError(
                key: "ConfirmPassword",
                title: "Passwords do not match",
                detail: "Passwords do not match",
                message: "Passwords do not match"
            );

        var result = await userService.Create(request.Adapt<User>());
        
        return Created("", result.Adapt<UserResponse>());
    }
}