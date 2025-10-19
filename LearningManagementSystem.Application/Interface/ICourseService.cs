using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface ICourseService
{
    public Task<List<Course>> GetAll();
    public Task<List<Course>> GetAllByTeacher(Guid teacherId);
    public Task<List<Course>> GetAllByStudent(Guid studentId);
    public Task<Course?> GetById(Guid id);
    public Task<Course?> GetByIdAndByStudent(Guid studentId, Guid id);
    public Task<Course> Create(Course course);
}