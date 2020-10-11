using System;

namespace Domain
{
  public class ActivityLikes
  {
    public Guid Id { get; set; }
    public Guid ActivityId { get; set; }
    public Guid UserId { get; set; }
  }
}