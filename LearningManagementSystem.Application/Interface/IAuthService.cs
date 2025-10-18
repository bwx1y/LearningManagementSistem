using LearningManagementSystem.Application.DTO.Auth;

namespace LearningManagementSystem.Application.Interface;

public interface IAuthService
{
    Task<LoginResponse?> Login(string email, string password);
}