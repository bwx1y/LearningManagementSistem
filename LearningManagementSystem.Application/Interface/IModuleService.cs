using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IModuleService
{
    Task<List<Module>> GetAll(Guid courseId);
}