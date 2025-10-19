using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Course;

public class CourseRequest
{
    [Required(ErrorMessage = "Course Name is required")]
    public required string Title { get; set; }
    [Required(ErrorMessage = "Course Description is required")]
    public required string Description { get; set; }
    [Required(ErrorMessage = "Teacher is required")]
    public required Guid TeacherId { get; set; }
}