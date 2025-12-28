using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;
[Table("QuizAttempt")]
public class QuizAttempt
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // FK ke Quiz
    public Guid QuizId { get; set; }
    public virtual Quiz Quiz { get; set; } = null!;

    // FK ke User
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public DateTime AttemptTime { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual ICollection<QuizAnswer> QuizAnswer { get; set; } = new List<QuizAnswer>();
}
