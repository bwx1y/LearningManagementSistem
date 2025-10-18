using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Auth;


public class LoginResponse
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public  string Name { get; set; }
    public string Email { get; set; } 
    public Role Role { get; set; }
    public string Token { get; set; }
}