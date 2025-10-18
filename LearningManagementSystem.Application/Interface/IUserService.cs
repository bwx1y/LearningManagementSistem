using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IUserService
{ 
    Task<User?> FindById(Guid id);
}