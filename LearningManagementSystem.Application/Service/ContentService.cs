using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class ContentService(LmsDbContext context) : IContentService
{
    public async Task<ModuleContent?> GetById(Guid course, Guid module, Guid id)
    {
        return await context.ModuleContent.FirstOrDefaultAsync(item => item.ModuleId == module && item.Module.CourseId == course && item.Id == id);
    }

    public async Task<ModuleContent> Create(ModuleContent moduleContent, Guid courseId)
    {
        int entityCount = await context.ModuleContent
            .CountAsync(item => item.ModuleId == moduleContent.ModuleId && item.Module.CourseId == courseId);

        moduleContent.Order = entityCount + 1;
        var entity = await context.ModuleContent.AddAsync(moduleContent);
        
        await context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task Delete(ModuleContent moduleContent)
    {
        context.ModuleContent.Remove(moduleContent);
        await context.SaveChangesAsync();
    }
}