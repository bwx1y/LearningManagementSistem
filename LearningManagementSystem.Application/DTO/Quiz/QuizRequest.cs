using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Quiz;

public class QuizRequest
{
    public required string Title { get; set; }
    public required DateTime StartTime { get; set; }
    public required DateTime EndTime { get; set; }
    public virtual List<QuizTeacherQuestionRequest> Question { get; set; } = new();
}

public class QuizTeacherChoiceRequest
{
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuizTeacherQuestionRequest
{
    public Guid Id { get; set; }
    public required string Text { get; set; }
    [MaxLength(4, ErrorMessage = "Choice max 4")]
    public virtual List<QuizTeacherChoiceRequest> Choice { get; set; } = new();
}