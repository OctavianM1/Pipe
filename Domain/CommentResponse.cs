using System;
using System.Collections.Generic;

namespace Domain
{
  public class CommentResponse
  {
    public Guid Id { get; set; }
    public Guid ParentActivityCommentId { get; set; }
    public virtual ActivityComment ActivityComment { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
    public string Comment { get; set; }
    public virtual ICollection<CommentResponseLikes> CommentResponseLikes { get; set; }
  }
}