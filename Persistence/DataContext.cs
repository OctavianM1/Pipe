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
  }
}
