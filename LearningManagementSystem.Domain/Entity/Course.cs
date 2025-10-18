using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Domain.Entity;

public class Course
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string Title { get; set; }
    
    [DataType(DataType.Text)]
    public required string Description { get; set; }
    
    public required Guid TeacherId { get; set; }
    public virtual User Teacher { get; set; } = null!;
    
    public virtual ICollection<Module> Module { get; set; } = new List<Module>();
}