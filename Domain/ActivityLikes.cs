using System;

namespace Domain
{
  public class ActivityLikes
  {
    public Guid Id { get; set; }
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
  }
}