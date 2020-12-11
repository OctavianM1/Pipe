using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
  public class DataContext : DbContext
  {
    public DataContext(DbContextOptions options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<User>()
        .HasMany(p => p.Activities)
        .WithOne(a => a.UserHost)
        .HasForeignKey(a => a.UserHostId);

      builder.Entity<SearchAllUsers>()
        .Property(s => s.Input)
        .IsRequired()
        .HasMaxLength(50);

      builder.Entity<SearchFollowingUsers>()
        .Property(s => s.Input)
        .IsRequired()
        .HasMaxLength(50);

      builder.Entity<SearchFollowsUsers>()
        .Property(s => s.Input)
        .IsRequired()
        .HasMaxLength(50);

      builder.Entity<SearchActivities>()
        .Property(s => s.Input)
        .IsRequired();

      builder.Entity<CommentResponse>()
        .HasOne(c => c.ActivityComment)
        .WithMany(ac => ac.CommentResponses)
        .HasForeignKey(c => c.ParentActivityCommentId);

      builder.Entity<CommentResponse>()
        .HasMany(c => c.CommentResponseLikes)
        .WithOne(cr => cr.CommentResponse)
        .HasForeignKey(c => c.CommentResponseId);

      builder.Entity<Notify>()
        .HasOne(n => n.NotifierUser)
        .WithMany(u => u.NotifierNotifications)
        .HasForeignKey(n => n.NotifierUserId);

      builder.Entity<Notify>()
        .HasOne(n => n.ObervableUser)
        .WithMany(u => u.ObservableNotifications)
        .HasForeignKey(n => n.ObervableUserId);
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityComment> ActivityComments { get; set; }
    public DbSet<ActivityLikes> ActivityLikes { get; set; }
    public DbSet<ActivityRaiting> ActivityRaiting { get; set; }
    public DbSet<Follows> Follows { get; set; }
    public DbSet<CommentLikes> CommentLikes { get; set; }
    public DbSet<SearchAllUsers> SearchAllUsers { get; set; }
    public DbSet<SearchFollowingUsers> SearchFollowingUsers { get; set; }
    public DbSet<SearchFollowsUsers> SearchFollowsUsers { get; set; }
    public DbSet<SearchActivities> SearchActivities { get; set; }
    public DbSet<SubscriberOnEmailNews> SubscriberOnEmailNews { get; set; }
    public DbSet<CommentResponse> CommentResponse { get; set; }
    public DbSet<CommentResponseLikes> CommentResponseLikes { get; set; }
    public DbSet<Notify> Notify { get; set; }
  }
}
