using System;

namespace ApplicationUser
{
  public class AppUsersActivity
  {
    public Guid UserHostId { get; set; }
    public Guid UserVisitorId { get; set; }
    public string Name { get; set; }
    public int CountFollowing { get; set; }
    public int CountFollows { get; set; }
    public int NumberOfActivities { get; set; }
    public bool IsVisitorFollowingHost { get; set; }
    public string CoverImageExtension { get; set; }

  }
}