using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Application.Service;

public class CourseService(LmsDbContext context): ICourseService
{
    public async Task<List<Course>> GetAll()
    {
        return await context.Course.Include(f => f.Teacher).ToListAsync();
    }

    public async Task<List<Course>> GetAllByTeacher(Guid teacherId)
    {
        return await context.Course.Include(f => f.Teacher).Where(x => x.TeacherId == teacherId).ToListAsync();
    }

    public async Task<List<Course>> GetAllByStudent(Guid studentId)
    {
        return await context.Course.Include(f => f.Teacher).Where(f => f.Enrollment.Any(x => x.UserId == studentId)).ToListAsync();
    }

    public async Task<Course?> GetById(Guid id)
    {
        return await context.Course.Include(f => f.Teacher).FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<Course?> GetByIdAndByStudent(Guid studentId, Guid id)
    {
        return await context.Course.Include(f => f.Teacher).FirstOrDefaultAsync(f => f.Id == id && f.Enrollment.Any(x => x.UserId == studentId));
    }
}