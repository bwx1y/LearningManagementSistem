using System.Net.Mime;
using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.DTO.Module;

public class ModuleCourseResponse
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required ContentType Type { get; set; }
    public int Order { get; set; }
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }
    public Guid? QuizId { get; set; }
}

public class ModuleResponse
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = null!;
    public int Order { get; set; }
    public virtual ModuleCourseResponse Course { get; set; } = null!;
}