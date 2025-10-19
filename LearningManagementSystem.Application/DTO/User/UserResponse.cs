using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.User;

public class UserResponse
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required Role Role { get; set; }
}