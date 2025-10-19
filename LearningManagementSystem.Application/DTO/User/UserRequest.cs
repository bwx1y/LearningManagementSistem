using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.User;

public class UserRequest
{
    [Required(ErrorMessage = "First name is required")]
    public required string Name { get; set; }
    [Required(ErrorMessage = "Email is required"), EmailAddress(ErrorMessage = "Invalid email address")]
    public required string Email { get; set; }
    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
    [Required(ErrorMessage = "Confirm password is required")]
    public required string ConfirmPassword { get; set; }
    [Required(ErrorMessage = "Role is required")]
    public required Role Role { get; set; }
}