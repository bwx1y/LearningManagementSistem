using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Auth;

public class LoginRequest
{
    [EmailAddress(ErrorMessage = "Email is invalid"),  Required(ErrorMessage = "Email is required")]
    public required string Email { get; set; }
    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}