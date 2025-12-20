using System.ComponentModel.DataAnnotations;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.DTO.Module;


public class ModuleRequest
{
    [Required(ErrorMessage = "Title is required")]
    public required string Title { get; set; }
}