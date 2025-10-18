using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Auth;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Application.Service;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
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
                title: "login failed",
                detail: "invalid credentials"
            );
        return Ok(token);
    }
}