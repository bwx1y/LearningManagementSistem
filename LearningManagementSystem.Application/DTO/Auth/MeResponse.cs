using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Auth;

public class MeResponse
{
    public Guid Id { get; set; } 
    public  string Name { get; set; }
    public string Email { get; set; } 
    public Role Role { get; set; }
}