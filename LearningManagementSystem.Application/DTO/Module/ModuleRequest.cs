using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Module;


public class ModuleContentRequest
{
    [Required(ErrorMessage = "Content type is required")]
    public required ContentType Type { get; set; }
    
    public int Order { get; set; }

    // Data umum (hanya satu yang akan dipakai tergantung tipe)
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }

    // Relasi ke quiz (kalau tipe == Quiz)
    public Guid? QuizId { get; set; }
}
public class ModuleRequest
{
    [Required(ErrorMessage = "Title is required")]
    public required string Title { get; set; }
    
    public int Order { get; set; } = 1;
    
    [Required(ErrorMessage = "Content type is required"), MaxLength(5, ErrorMessage = "Content type is too long"), MinLength(1, ErrorMessage = "Content type is too short")]
    public required List<ModuleContentRequest> Content { get; set; }
}