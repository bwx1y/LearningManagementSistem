using LearningManagementSystem.Application.DTO.Content;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Module;


public class ModuleResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public int Order { get; set; }
    public DateTime CratedAt { get; set; }
    public virtual List<ContentResponse> Content { get; set; } = new();
}