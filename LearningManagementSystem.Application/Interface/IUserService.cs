using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Application.Interface;

public interface IUserService
{ 
    Task<List<User>> GetAll(Role? role = null, string? search = null);
    Task<List<User>> GetAllByCourseId(Guid courseId);
    Task<User?> FindById(Guid id);
    Task<User> Create(User user);
    Task<User> Update(User user, string? newPassword = null);
    Task Delete(User user);
}