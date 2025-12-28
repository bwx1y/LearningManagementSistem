using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("QuizAnswer")]
public class QuizAnswer
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK ke QuizAttempt
    public Guid AttemptId { get; set; }
    public virtual QuizAttempt QuizAttempt { get; set; } = null!;

    // FK ke Choice (jawaban yang dipilih)
    public Guid ChoiceId { get; set; }
    public virtual Choice Choice { get; set; } = null!;
}
