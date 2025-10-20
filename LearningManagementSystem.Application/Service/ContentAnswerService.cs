using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;

namespace LearningManagementSystem.Application.Service;

public class ContentAnswerService(LmsDbContext context): IContentAnswer
{
    public async Task<ModuleContentAnswer> Answer(ModuleContentAnswer answer)
    {
        var entity = await context.ModuleContentAnswer.AddAsync(answer);
        await context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task Delete(ModuleContentAnswer answer)
    {
        context.ModuleContentAnswer.Remove(answer);
        await context.SaveChangesAsync();
    }
}