using System;

namespace Domain
{
  public class CommentLikes
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }

    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }

    public Guid CommentId { get; set; }
  }
}