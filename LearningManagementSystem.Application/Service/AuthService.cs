using LearningManagementSystem.Api.Configuration;
using LearningManagementSystem.Application.DTO.Auth;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Infrastructure.Persistence;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LearningManagementSystem.Application.Service;

public class AuthService(LmsDbContext context, IConfiguration configuration): IAuthService
{
    public async Task<LoginResponse?> Login(string email, string password)
    {
        var findUser = await context.User.FirstOrDefaultAsync(f => f.Email == email);
        if (findUser == null) return null;
        
        bool verified = BCrypt.Net.BCrypt.Verify(password, findUser.Password);
        if (!verified) return null;

        var key = configuration.GetValue<string>("JwtSettings:Key");
        var duration = configuration.GetValue<int>("JwtSettings:DurationInMinutes");
        var hoursToExpire = (int) Math.Ceiling((double) duration /60);

        if (key == null || duration == 0 || hoursToExpire == 0) return null;
        
        var token = findUser.GenerateToken(key, hoursToExpire);
        
        var response = findUser.Adapt<LoginResponse>();
        response.Token = token;
        response.Role =  findUser.Role.ToString();
        
        return response;
    }
}