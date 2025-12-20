using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Auth;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Application.Service;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService, IUserService userService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var token = await authService.Login(request.Email, request.Password);
        if (token == null)
            return this.ValidationError(
                statusCode: StatusCodes.Status401Unauthorized,
                key: "Login",
                message: "Email or Password wrong",
                title: "login failed"
            );
        return Ok(token);
    }

    [HttpGet("me"), Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.GetUserId();

        var user = await userService.FindById(userId);
        if (user == null)
            return this.ValidationError(
                statusCode: StatusCodes.Status401Unauthorized,
                key: "Me",
                message: "User not found",
                title: "not login"
            );
        
        return Ok(user.Adapt<MeResponse>());
    }
    
}