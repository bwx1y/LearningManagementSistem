using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IQuizService
{
    Task<Quiz?> GetOne(Guid quizId);
    Task<bool> Accepted(Guid userId, Guid quizId);
    Task<Quiz> Create(QuizRequest quiz, Guid moduleId, Guid courseId);
    Task Update(Guid id,QuizUpdateRequest quiz);
    Task Delete(Quiz quiz);
    Task<List<QuizResultResponse>> GetResult(Guid id);
    Task<QuizAttempt> CreateResult(Guid userId, Guid id, List<QuizResultRequest> req);
}