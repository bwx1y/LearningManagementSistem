using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Domain.Entity;

[Table("ModuleContent")]
public class ModuleContent
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public required Guid ModuleId { get; set; }
    public virtual Module Module { get; set; } = null!;

    // Jenis konten (Text, Link, File, Quiz)
    public required ContentType Type { get; set; }
    
    public int Order { get; set; }

    // Data umum (hanya satu yang akan dipakai tergantung tipe)
    public string? TextContent { get; set; }
    public string? LinkUrl { get; set; }

    // Relasi ke quiz (kalau tipe == Quiz)
    public Guid? QuizId { get; set; }
    public virtual Quiz? Quiz { get; set; }
    
    public virtual ICollection<ModuleContentAnswer> Answer { get; set; } = new List<ModuleContentAnswer>();
}