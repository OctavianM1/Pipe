using System;

namespace Domain
{
  public class CommentLikes
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ActivityId { get; set; }
    public Guid CommentId { get; set; }
  }
}