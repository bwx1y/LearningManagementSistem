using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class ModuleService(LmsDbContext context) : IModuleService
{
    public async Task<List<Module>> GetAll(Guid courseId)
    {
        return await context.Module
            .Include(m => m.Content)
            .ThenInclude(c => c.Answer)
            .Include(m => m.Content)
            .ThenInclude(c => c.Quiz)
            .ThenInclude(q => q.QuizAttempt)
            .Where(m => m.CourseId == courseId)
            .OrderBy(m => m.Order)
            .ToListAsync();
    }
    
    public async Task<Module?> GetByIdAndByCourseId(Guid courseId, Guid moduleId)
    {
        var entity = await context.Module.Include(f => f.Content).FirstOrDefaultAsync(f => f.Id == moduleId && f.CourseId == courseId);
        return entity;
    }

    public async Task<Module> Create(Guid courseId, Module module)
    {
        module.CourseId = courseId;
        
        int moduleCount = await context.Module.CountAsync(item => item.CourseId == courseId);
        
        module.Order = moduleCount + 1;
        
        var entity = await context.Module.AddAsync(module);
        await context.SaveChangesAsync();
        
        return entity.Entity;
    }

    public async Task<Module> Update(Module module, ModuleUpdateRequest request)
    {
        module.Title = request.Title;
        
        var entity = context.Module.Update(module);
        await context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task Delete(Module module)
    {
        context.Module.Remove(module);
        await context.SaveChangesAsync();
    }
}