using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Enrollment")]
public class Enrollment
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public required Guid UserId {get; set;}
    public virtual User User { get; set; } = null!;
    
    public required Guid CourseId {get; set;}
    public virtual Course Course { get; set; } = null!;
    
    public required DateTime EnrollmentDate {get; set;}
}