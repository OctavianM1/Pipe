using System;

namespace Domain
{
  public class ActivityLikes
  {
    public Guid Id { get; set; }
    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
  }
}