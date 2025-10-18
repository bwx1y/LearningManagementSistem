using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class UserService (LmsDbContext context): IUserService
{
    public async Task<User?> FindById(Guid id)
    {
        return await context.User.FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<User> Create(User user)
    {
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        
        var res = await context.User.AddAsync(user);
        
        await context.SaveChangesAsync();
        
        return res.Entity;
    }
}