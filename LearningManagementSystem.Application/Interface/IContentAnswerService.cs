using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IContentAnswerService
{
    Task<ModuleContentAnswer?> GetAnswer(Guid courseId, Guid moduleId, Guid contentId, Guid userId);
    Task<List<ModuleContentAnswer>> GetAllAnswer(Guid courseId, Guid moduleId, Guid contentId);
    Task<ModuleContentAnswer> Answer(ModuleContentAnswer answer);
    Task Delete(ModuleContentAnswer answer);
}