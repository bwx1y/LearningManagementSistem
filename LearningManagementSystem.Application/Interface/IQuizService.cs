using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IQuizService
{
    Task<Quiz?> GetOne(Guid quizId);
    Task<Quiz> Create(QuizRequest quiz);
    Task Update(Guid id, QuizRequest quiz);
}