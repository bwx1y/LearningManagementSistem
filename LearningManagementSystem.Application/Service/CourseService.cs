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

    public async Task<Course> Create(Course course)
    {
        var entity = await context.Course.AddAsync(course);
        await context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task<Course> Update(Course course)
    {
        var entity = context.Course.Update(course);
        await context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task Delete(Course course)
    {
        context.Course.Remove(course);
        await context.SaveChangesAsync();
    }

    public async Task<bool> CreateEnrollment(User user, Course course)
    {
        var find = context.Enrollment.Any(f => f.UserId == user.Id && f.CourseId == course.Id);
        if (find) return false;

        context.Enrollment.Add(new Enrollment
        {
            UserId = user.Id,
            CourseId = course.Id,
            EnrollmentDate = DateTime.Now
        });
        await context.SaveChangesAsync();
        return true;
    }

    public async Task DeleteEnrollment(User user, Course course)
    {
        var find = await context.Enrollment.FirstOrDefaultAsync(f => f.UserId ==  user.Id && f.CourseId == course.Id);
        if (find == null) return;
        
        context.Enrollment.Remove(find);
        await context.SaveChangesAsync();
    }
}