namespace LearningManagementSystem.Application.DTO.Quiz;

public class QuizResultRequest
{
    public required Guid QuestionId { get; set; }
    public required Guid ChoiceId { get; set; }
}