using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.User;

public class UserUpdateRequest
{
    [Required(ErrorMessage = "First name is required")]
    public required string Name { get; set; }
    [Required(ErrorMessage = "Email is required"), EmailAddress(ErrorMessage = "Invalid email address")]
    public required string Email { get; set; }
    public string? Password { get; set; } = null;
    public string? ConfirmPassword { get; set; } = null;
    [Required(ErrorMessage = "Role is required")]
    public required Role Role { get; set; }
}