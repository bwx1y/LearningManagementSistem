using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Module")]
public class Module
{
    [Key] 
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Title { get; set; }
    public int Order { get; set; }
    public required Guid CourseId { get; set; }
    public virtual Course Course { get; set; } = null!;
    public virtual ICollection<ModuleContent> Content { get; set; } = new List<ModuleContent>();
}