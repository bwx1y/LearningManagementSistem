namespace LearningManagementSystem.Application.DTO.Course;

public class CourseTeacherResponse
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
}

public class CourseResponse
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required CourseTeacherResponse Teacher  { get; set; }
}