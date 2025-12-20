using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class QuizService(LmsDbContext context, IContentService contentService): IQuizService
{
    public async Task<Quiz?> GetOne(Guid quizId)
    {
        var entity = await context.Quiz
            .Include(f => f.Question)
            .ThenInclude(f => f.Choice)
            .FirstOrDefaultAsync(f => f.Id == quizId);
        return entity;
    }

    public async Task<bool> Accepted(Guid userId, Guid quizId)
    {
        return await context.QuizAttempt.AnyAsync(f => f.QuizId == quizId && f.UserId == userId);
    }

    public async Task<Quiz> Create(QuizRequest data, Guid moduleId, Guid courseId)
    {
        var quiz = new Quiz
        {
            Title = data.Title,
            StartTime = data.StartTime,
            EndTime = data.EndTime,
            Question = data.Question.Select(q => new QuizQuestion
            {
                Text = q.Text,
                Choice = q.Choice.Select(c => new Choice
                {
                    Text = c.Text,
                    IsCorrect = c.IsCorrect
                }).ToList()
            }).ToList()
        };
        
        var entity = await context.Quiz.AddAsync(quiz);

        await contentService.Create(new ModuleContent
        {
            ModuleId = moduleId,
            Type = ContentType.Quiz,
            TextContent = data.Title,
            QuizId = entity.Entity.Id
        }, courseId);
        
        await context.SaveChangesAsync();
        
        return entity.Entity;
    }

    public async Task Update(Quiz quiz)
    {
        context.Quiz.Update(quiz);
        await context.SaveChangesAsync();
    }

    public async Task Delete(Quiz quiz)
    {
        context.Quiz.Remove(quiz);
        await context.SaveChangesAsync();
    }
}