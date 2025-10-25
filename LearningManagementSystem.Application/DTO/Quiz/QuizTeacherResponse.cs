namespace LearningManagementSystem.Application.DTO.Quiz;

public class QuizTeacherChoiceResponse
{
    public Guid Id { get; set; }
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuizTeacherQuestionResponse
{
    public Guid Id { get; set; }
    public required string Text { get; set; }
    public virtual List<QuizTeacherChoiceResponse> Choice { get; set; } = new();
}

public class QuizTeacherResponse
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required DateTime StartTime { get; set; }
    public required DateTime EndTime { get; set; }
    public virtual List<QuizTeacherQuestionResponse> Question { get; set; } = new();
}