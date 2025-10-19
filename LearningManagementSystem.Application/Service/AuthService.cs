using LearningManagementSystem.Application.Configuration;
using LearningManagementSystem.Application.DTO.Auth;
using LearningManagementSystem.Application.Extention;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Infrastructure.Persistence;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace LearningManagementSystem.Application.Service;

public class AuthService(LmsDbContext context, IOptions<JwtConfiguration> jwtConfig): IAuthService
{
    public async Task<LoginResponse?> Login(string email, string password)
    {
        var findUser = await context.User.FirstOrDefaultAsync(f => f.Email == email);
        if (findUser == null) return null;
        
        bool verified = BCrypt.Net.BCrypt.Verify(password, findUser.Password);
        if (!verified) return null;

        if (jwtConfig.Value.Key.Length == 0 || jwtConfig.Value.DurationInMinutes == 0) return null;
        
        var token = findUser.GenerateToken(jwtConfig.Value);
        
        var response = findUser.Adapt<LoginResponse>();
        response.Token = token;
        response.Role =  findUser.Role.ToString();
        
        return response;
    }
}