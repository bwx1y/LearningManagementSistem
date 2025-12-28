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

    public async Task Update(Guid id,QuizUpdateRequest quiz)
    {
        var entity = (await GetOne(id))!;
        
        entity.Title = quiz.Title;
        entity.StartTime = quiz.StartTime;
        entity.EndTime = quiz.EndTime;

        var listTrash = entity.Question.ToList();

        foreach (var question in quiz.Question)
        {
            if (question.Id.HasValue)
            {
                var item = entity.Question.FirstOrDefault(f => f.Id == question.Id.Value);

                if (item != null)
                {
                    listTrash.Remove(item);

                    item.Text = question.Text;
                    
                    var listChoiceTrash = item.Choice.ToList();

                    foreach (var choice in question.Choice)
                    {
                        var value = item.Choice.FirstOrDefault(f => f.Id == choice.Id);

                        if (value != null)
                        {
                            listChoiceTrash.Remove(value);
                            
                            value.Text = choice.Text;
                            value.IsCorrect = choice.IsCorrect;
                            
                            context.Choice.Update(value);
                        }
                    }
                    
                    context.Question.Update(item);
                    context.Choice.RemoveRange(listChoiceTrash);
                }
            }
            else
            {
                var value = new QuizQuestion
                {
                    Text = question.Text,
                    QuizId = entity.Id,
                };

                value.Choice = question.Choice.Select(item => new Choice
                {
                    Text = item.Text,
                    IsCorrect = item.IsCorrect,
                    QuestionId = value.Id
                }).ToList();
                
                context.Question.Add(value);
            }
        }
        
        context.Question.RemoveRange(listTrash);
        await context.SaveChangesAsync();
    }

    public async Task Delete(Quiz quiz)
    {
        context.Quiz.Remove(quiz);
        await context.SaveChangesAsync();
    }

    public async Task<List<QuizResultResponse>> GetResult(Guid id)
    {
        var quiz = await context.Quiz
            .Include(f => f.Question)
            .Include(f => f.QuizAttempt)
            .ThenInclude(f => f.User)
            .Include(f => f.QuizAttempt)
            .ThenInclude(f => f.QuizAnswer)
            .ThenInclude(f => f.Choice)
            .FirstAsync(f => f.Id == id);
        
        return quiz.QuizAttempt.Select(item =>
        {
            int correctCount = item.QuizAnswer.Count(f => f.Choice.IsCorrect);
            int questionCount = quiz.Question.Count;
            
            return new QuizResultResponse
            {
                Email = item.User.Email,
                Name = item.User.Name,
                Score = (double) correctCount / questionCount * 100, 
            };
        }).ToList();
    }

    public async Task<QuizAttempt> CreateResult(Guid userId, Guid id, List<QuizResultRequest> req)
    {
        var entity = new QuizAttempt
        {
            QuizId = id,
            UserId = userId,
            AttemptTime = DateTime.UtcNow,
        };

        entity.QuizAnswer = req.Select(item => new QuizAnswer
        {
            AttemptId = entity.Id,  
            ChoiceId = item.ChoiceId,
        }).ToList();
        
        await context.QuizAttempt.AddAsync(entity);
        await context.SaveChangesAsync();
        
        return entity;
    }
}