using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Content;

public class ContentResponse
{
    public Guid Id { get; set; }
    public required ContentType Type { get; set; }
    public int Order { get; set; }
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }
    public Guid? QuizId { get; set; }
}