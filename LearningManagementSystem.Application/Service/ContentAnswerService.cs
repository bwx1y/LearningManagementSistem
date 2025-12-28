using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class ContentAnswerService(LmsDbContext context): IContentAnswerService
{
    public async Task<ModuleContentAnswer?> GetAnswer(Guid courseId, Guid moduleId, Guid contentId, Guid userId)
    {
        var entityModule = await context.ModuleContent
            .Include(mc => mc.Module)
            .Include(mc => mc.Answer)
            .FirstOrDefaultAsync(mc =>
                    mc.Id == contentId &&                 // ✅ content
                    mc.ModuleId == moduleId &&            // ✅ module
                    mc.Module.CourseId == courseId        // ✅ course
            );
        if (entityModule == null) return null;
        
        return entityModule.Answer.FirstOrDefault(a => a.UserId == userId);
    }

    public async Task<List<ModuleContentAnswer>> GetAllAnswer(Guid courseId, Guid moduleId, Guid contentId)
    {
        var entityModule = await context.ModuleContent
            .Include(mc => mc.Module)
            .Include(mc => mc.Answer)
            .ThenInclude(f => f.User)
            .FirstOrDefaultAsync(mc =>
                    mc.Id == contentId &&                 // ✅ content
                    mc.ModuleId == moduleId &&            // ✅ module
                    mc.Module.CourseId == courseId        // ✅ course
            );
        if (entityModule == null) return new List<ModuleContentAnswer>();

        return entityModule.Answer.ToList();
    }

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