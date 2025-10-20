using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Module;

public class ModuleContentUpdateRequest
{
    public Guid? Id { get; set; }
    [Required(ErrorMessage = "Content type is required")]
    public required ContentType Type { get; set; }
    public int Order { get; set; }
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }
    public Guid? QuizId { get; set; }
}

public class ModuleUpdateRequest
{
    [Required(ErrorMessage = "Title is required")]
    public required string Title { get; set; }
    public int Order { get; set; } = 1;
    [Required(ErrorMessage = "Content type is required"), MaxLength(5, ErrorMessage = "Content type is too long"), MinLength(1, ErrorMessage = "Content type is too short")]
    public required List<ModuleContentUpdateRequest> Content { get; set; }
}