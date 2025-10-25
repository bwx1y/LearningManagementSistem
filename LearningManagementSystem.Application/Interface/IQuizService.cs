using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IQuizService
{
    Task<Quiz?> GetOne(Guid quizId);
}