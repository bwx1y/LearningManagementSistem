namespace LearningManagementSystem.Application.DTO.Quiz;

public class QuizUserChoiceResponse
{
    public Guid Id { get; set; }
    public required string Text { get; set; }
}

public class QuizUserQuestionResponse
{
    public Guid Id { get; set; }
    public required string Text { get; set; }
    public virtual List<QuizUserChoiceResponse> Choice { get; set; } = new();
}

public class QuizUserResponse
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required DateTime StartTime { get; set; }
    public required DateTime EndTime { get; set; }
    public required bool Accepted { get; set; }
    public virtual List<QuizUserQuestionResponse> Question { get; set; } = new();
}