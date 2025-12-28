using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace LearningManagementSystem.Domain.Entity;

[Table("ModuleContentAnswer")]
public class ModuleContentAnswer
{
    [Key]
    public Guid Id { get; set; } =  Guid.NewGuid();
    
    public Guid ModuleContentId { get; set; }
    public virtual ModuleContent ModuleContent { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public required string UrlFile { get; set; }
}