namespace LearningManagementSystem.Application.DTO.Course;

public class CourseUserResponse
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
}