using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IContentAnswer
{
    Task<ModuleContentAnswer> Answer(ModuleContentAnswer answer);
    Task Delete(ModuleContentAnswer answer);
}