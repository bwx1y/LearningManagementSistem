using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Auth;

public class RefreshTokenRequest
{
    [Required(ErrorMessage = "Token is required")]
    public required string Token { get; set; }
}