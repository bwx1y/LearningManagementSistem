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
}