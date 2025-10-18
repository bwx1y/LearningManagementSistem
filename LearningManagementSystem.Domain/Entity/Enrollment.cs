using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Enrollment")]
public class Enrollment
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
}