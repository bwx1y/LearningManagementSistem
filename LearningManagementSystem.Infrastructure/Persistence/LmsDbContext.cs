using LearningManagementSystem.Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Infrastructure.Persistence;

public class LmsDbContext(DbContextOptions<LmsDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Choice> Choices { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }
    public DbSet<QuizAnswer> QuizAnswers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User - Course (Teacher) => One-to-Many
        modelBuilder.Entity<Course>()
            .HasOne(c => c.Teacher)
            .WithMany(u => u.CoursesTaught)
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // User - Course (Enrollment) => Many-to-Many
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId);

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany()
            .HasForeignKey(e => e.CourseId);

        // Course - Module => One-to-Many
        modelBuilder.Entity<Module>()
            .HasOne(m => m.Course)
            .WithMany(c => c.Module)
            .HasForeignKey(m => m.CourseId);

        // Module - Quiz => One-to-Many
        modelBuilder.Entity<Quiz>()
            .HasOne(q => q.Module)
            .WithMany(m => m.Quizze)
            .HasForeignKey(q => q.ModuleId);

        // Quiz - Choice => One-to-Many
        modelBuilder.Entity<Choice>()
            .HasOne(c => c.Quiz)
            .WithMany(q => q.Choice)
            .HasForeignKey(c => c.QuizId);

        // QuizAttempt - QuizAnswer => One-to-Many
        modelBuilder.Entity<QuizAnswer>()
            .HasOne(qa => qa.QuizAttempt)
            .WithMany(qa => qa.QuizAnswer)
            .HasForeignKey(qa => qa.AttemptId);

        // QuizAnswer - Choice => One-to-One
        modelBuilder.Entity<QuizAnswer>()
            .HasOne(qa => qa.Choice)
            .WithMany()
            .HasForeignKey(qa => qa.ChoiceId);

        // QuizAnswer - Quiz
        modelBuilder.Entity<QuizAnswer>()
            .HasOne(qa => qa.Quiz)
            .WithMany()
            .HasForeignKey(qa => qa.QuizId);
        
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.User)
            .WithMany(u => u.Enrollment)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany(c => c.Enrollment)
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}