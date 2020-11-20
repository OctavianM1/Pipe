using System;

namespace Domain
{
  public class CommentResponseLikes
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
    public Guid CommentResponseId { get; set; }
    public virtual CommentResponse CommentResponse { get; set; }
  }
}