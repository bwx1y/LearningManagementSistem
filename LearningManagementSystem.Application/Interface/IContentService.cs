using LearningManagementSystem.Application.DTO.Content;
using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IContentService
{
    Task<ModuleContent?> GetById(Guid course, Guid module, Guid id);
    Task<ModuleContent> Create(ModuleContent moduleContent, Guid courseId);
    Task Delete(ModuleContent moduleContent);
}