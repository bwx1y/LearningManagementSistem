using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class UserService(LmsDbContext context) : IUserService
{
    public async Task<List<User>> GetAll(Role? role = null, string? search = null)
    {
        var query = context.User.AsQueryable();
        if (role != null) query = query.Where(u => u.Role == role);
        if (search != null) query = query.Where(u => EF.Functions.Like(u.Email, $"%{search}%"));

        return await query.ToListAsync();
    }

    public async Task<List<User>> GetAllByCourseId(Guid courseId)
    {
        var query = context.Enrollment.Include(f => f.User).AsQueryable();
        
        query = query.Where(f => f.CourseId == courseId);
        
        return await query.Select(f => f.User).ToListAsync();
    }

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

    public async Task<User> Update(User user, string? newPassword = null)
    {
        if (!string.IsNullOrEmpty(newPassword)) user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);

        var updated = context.User.Update(user);
        await context.SaveChangesAsync();
        return updated.Entity;
    }

    public async Task Delete(User user)
    {
        context.User.Remove(user);
        await context.SaveChangesAsync();
    }
}