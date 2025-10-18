using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("QuizAttempt")]
public class QuizAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required Guid QuizId { get; set; }
    public virtual Quiz Quiz { get; set; } = null!;
    
    public required Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public required float Score { get; set; }
    
    public DateTime AttemptTime { get; set; } = DateTime.Now;
    
    public virtual ICollection<QuizAnswer> QuizAnswer { get; set; } = new List<QuizAnswer>();
}