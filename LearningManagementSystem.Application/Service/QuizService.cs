using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class QuizService(LmsDbContext context): IQuizService
{
    public async Task<Quiz?> GetOne(Guid quizId)
    {
        var entity = await context.Quiz
            .Include(f => f.Question)
            .ThenInclude(f => f.Choice)
            .FirstOrDefaultAsync(f => f.Id == quizId);
        return entity;
    }
}