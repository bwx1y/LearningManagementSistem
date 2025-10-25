using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Choice")]
public class Choice
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // Relasi ke pertanyaan
    public required Guid QuestionId { get; set; }
    public virtual QuizQuestion Question { get; set; } = null!;

    public required string Text { get; set; }
    public bool IsCorrect { get; set; }
}