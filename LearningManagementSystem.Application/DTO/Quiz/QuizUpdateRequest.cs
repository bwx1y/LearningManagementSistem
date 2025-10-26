using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Application.DTO.Quiz;

public class QuizUpdateRequest
{
    public required string Title { get; set; }
    public required DateTime StartTime { get; set; }
    public required DateTime EndTime { get; set; }
    public virtual List<QuizQuestionUpdateRequest> Question { get; set; } = new();
}

public class QuizChoiceUpdateRequest
{
    public Guid? Id { get; set; }
    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuizQuestionUpdateRequest
{
    public Guid? Id { get; set; }
    public required string Text { get; set; }
    [MaxLength(4, ErrorMessage = "Choice max 4")]
    public virtual List<QuizChoiceUpdateRequest> Choice { get; set; } = new();
}