using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Content;

public class ContentRequest
{
    [Required(ErrorMessage = "Content type is required")]
    public required ContentType Type { get; set; }
    
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }
    
    public Guid? QuizId { get; set; }
}