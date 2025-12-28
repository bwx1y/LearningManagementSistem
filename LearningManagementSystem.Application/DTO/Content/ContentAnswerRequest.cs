using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Content;

public class ContentAnswerRequest
{
    [Required(ErrorMessage = "file is required")]
    public required string UrlFile { get; set; }
}