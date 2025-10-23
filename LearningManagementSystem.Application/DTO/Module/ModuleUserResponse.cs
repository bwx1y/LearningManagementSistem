using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Module;

public class ModuleContentUserResponse
{
    public Guid Id { get; set; }
    public required ContentType Type { get; set; }
    public int Order { get; set; }
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }
    public Guid? QuizId { get; set; }
    public bool Done { get; set; }
}

public class ModuleUserResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public int Order { get; set; }
    public virtual List<ModuleContentUserResponse> Content { get; set; } = new();
}