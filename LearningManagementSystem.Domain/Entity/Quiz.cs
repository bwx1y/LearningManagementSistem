using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearningManagementSystem.Domain.Entity;

[Table("Quiz")]
public class Quiz
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public required string Title { get; set; }

    public required DateTime StartTime { get; set; }
    public required DateTime EndTime { get; set; }
    public virtual ICollection<QuizQuestion> Question { get; set; } = new List<QuizQuestion>();
    public virtual ICollection<QuizAttempt> QuizAttempt { get; set; } = new List<QuizAttempt>();
}