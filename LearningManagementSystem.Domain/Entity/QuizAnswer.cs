using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("QuizAnswer")]
public class QuizAnswer
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public required Guid AttemptId { get; set; }
    public virtual QuizAttempt QuizAttempt { get; set; } = null!;

    public Guid QuizId { get; set; }
    public virtual Quiz Quiz { get; set; } = null!;

    public required Guid ChoiceId { get; set; }
    public virtual Choice Choice { get; set; } = null!;
}