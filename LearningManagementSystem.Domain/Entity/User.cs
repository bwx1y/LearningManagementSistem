using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Domain.Entity;

[Table("User")]
public class User
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }

    [DefaultValue(Role.Student)] public Role Role { get; set; } = Role.Student;

    public virtual ICollection<Course> CoursesTaught { get; set; } = new List<Course>();
    public virtual ICollection<Enrollment> Enrollment { get; set; } = new List<Enrollment>();
    public virtual ICollection<ModuleContentAnswer> ModuleContentAnswer { get; set; } = new List<ModuleContentAnswer>();
}