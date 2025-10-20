using LearningManagementSystem.Application.DTO.Module;
using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IModuleService
{
    Task<List<Module>> GetAll(Guid courseId);
    Task<Module?> GetByIdAndByCourseId(Guid courseId, Guid moduleId);
    Task<Module> Create(Guid courseId, Module module);
    Task<Module> Update(Module module, ModuleUpdateRequest request);
    
    Task Delete(Module module);
}