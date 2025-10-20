using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class ModuleService(LmsDbContext context) : IModuleService
{
    public async Task<List<Module>> GetAll(Guid courseId)
    {
        return await context.Module.Include(f => f.Content).Where(f => f.CourseId == courseId).OrderBy(f => f.Order)
            .ToListAsync();
    }

    public async Task<Module?> GetByIdAndByCourseId(Guid courseId, Guid moduleId)
    {
        var entity = await context.Module.Include(f => f.Content).FirstOrDefaultAsync(f => f.Id == moduleId && f.CourseId == courseId);
        return entity;
    }

    public Task<Module> Create(Guid courseId, Module module)
    {
        return null;
    }
}