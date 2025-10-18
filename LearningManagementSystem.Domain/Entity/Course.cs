using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Course")]
public class Course
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public required string Title { get; set; }

    [DataType(DataType.Text)] public required string Description { get; set; }

    public required Guid TeacherId { get; set; }
    public virtual User Teacher { get; set; } = null!;

    public virtual ICollection<Module> Module { get; set; } = new List<Module>();
    public virtual ICollection<Enrollment> Enrollment { get; set; } = new List<Enrollment>();
}