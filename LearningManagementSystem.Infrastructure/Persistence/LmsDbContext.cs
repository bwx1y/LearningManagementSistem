using LearningManagementSystem.Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace LearningManagementSystem.Infrastructure.Persistence;

public class LmsDbContext(DbContextOptions<LmsDbContext> options) : DbContext(options)
{
    public DbSet<User> User { get; set; }
    public DbSet<Course> Course { get; set; }
    public DbSet<ModuleContent> ModuleContent { get; set; }
    public DbSet<ModuleContentAnswer> ModuleContentAnswer { get; set; }
    public DbSet<Enrollment> Enrollment { get; set; }
    public DbSet<Module> Module { get; set; }
    public DbSet<Quiz> Quiz { get; set; }
    public DbSet<Choice> Choice { get; set; }
    public DbSet<QuizAttempt> QuizAttempt { get; set; }
    public DbSet<QuizAnswer> QuizAnswer { get; set; }

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

        // === Relasi Module -> ModuleContent (One-to-Many) ===
        modelBuilder.Entity<ModuleContent>()
            .HasOne(mc => mc.Module)
            .WithMany(m => m.Content)  
            .HasForeignKey(mc => mc.ModuleId)
            .OnDelete(DeleteBehavior.Cascade);

        // === Relasi ModuleContent -> Quiz (Optional One-to-One) ===
        modelBuilder.Entity<ModuleContent>()
            .HasOne(mc => mc.Quiz)
            .WithMany()
            .HasForeignKey(mc => mc.QuizId)
            .OnDelete(DeleteBehavior.SetNull); 

        // === Relasi Course -> Module (One-to-Many) ===
        modelBuilder.Entity<Module>()
            .HasOne(m => m.Course)
            .WithMany(c => c.Module) 
            .HasForeignKey(m => m.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // === Relasi ModuleContent -> ModuleContentAnswer (One-to-Many) ===
        modelBuilder.Entity<ModuleContentAnswer>()
            .HasOne(a => a.ModuleContent)
            .WithMany(mc => mc.Answer)
            .HasForeignKey(a => a.ModuleContentId)
            .OnDelete(DeleteBehavior.Cascade);

        // === Relasi User -> ModuleContentAnswer (One-to-Many) ===
        modelBuilder.Entity<ModuleContentAnswer>()
            .HasOne(a => a.User)
            .WithMany(u => u.ModuleContentAnswer)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Quiz - Choice => One-to-Many
        modelBuilder.Entity<QuizQuestion>()
            .HasOne(q => q.Quiz)
            .WithMany(z => z.Question)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);


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