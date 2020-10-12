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
    public DbSet<User> Users { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityComment> ActivityComments { get; set; }
    public DbSet<ActivityLikes> ActivityLikes { get; set; }
    public DbSet<ActivityRaiting> ActivityRaiting { get; set; }
    public DbSet<Follows> Follows { get; set; }
    public DbSet<CommentLikes> CommentLikes { get; set; }

  }
}
