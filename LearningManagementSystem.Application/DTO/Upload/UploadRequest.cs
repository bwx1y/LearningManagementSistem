using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Upload;

public class UploadRequest
{
    [Required(ErrorMessage = "File name is required")]
    public required string FileName { get; set; }
}