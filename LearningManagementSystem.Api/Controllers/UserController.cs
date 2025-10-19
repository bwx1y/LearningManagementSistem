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

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOne(Guid id)
    {
        var find = await userService.FindById(id);
        if (find == null)
            return this.ValidationError("User", "User not found", StatusCodes.Status404NotFound, "User not found");
        return Ok(find.Adapt<UserResponse>());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] UserRequest request)
    {
        if (request.ConfirmPassword != request.Password)
            return this.ValidationError(
                "ConfirmPassword",
                title: "Passwords do not match",
                detail: "Passwords do not match",
                message: "Passwords do not match"
            );

        var result = await userService.Create(request.Adapt<User>());

        return Created("", result.Adapt<UserResponse>());
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UserUpdateRequest request)
    {
        var findUser = await userService.FindById(id);
        if (findUser == null)
            return this.ValidationError("User", "User not found", StatusCodes.Status404NotFound, "User not found");

        if (request.Password != null && request.Password != request.ConfirmPassword)
            return this.ValidationError(
                "ConfirmPassword",
                title: "Passwords do not match",
                detail: "Passwords do not match",
                message: "Passwords do not match"
            );

        var entity = request.Adapt(findUser);

        var userUpdated = await userService.Update(entity, request.Password);

        return Ok(userUpdated.Adapt<UserResponse>());
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var find = await userService.FindById(id);
        if (find == null)
            return this.ValidationError("User", "User not found", StatusCodes.Status404NotFound, "User not found");

        await userService.Delete(find);
        return Ok(new
        {
            Message = "User successfully deleted"
        });
    }
}