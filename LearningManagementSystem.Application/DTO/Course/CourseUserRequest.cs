using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Course;

public class CourseUserRequest
{
    [Required(ErrorMessage = "User is required")]
    public Guid UserId { get; set; }
}