using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("QuizQuestion")]
public class QuizQuestion
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid QuizId { get; set; }
    public virtual Quiz Quiz { get; set; } = null!;

    public required string Text { get; set; }

    // Bisa jadi 1 pertanyaan punya beberapa pilihan
    public virtual ICollection<Choice> Choice { get; set; } = new List<Choice>();
}