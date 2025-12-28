namespace LearningManagementSystem.Application.DTO.Content;

public class ContentAnswerTeacherResponse
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string FileUrl { get; set; }
}