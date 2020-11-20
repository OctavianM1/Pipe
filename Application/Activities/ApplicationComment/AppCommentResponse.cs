using System;
using System.Collections.Generic;
using Application.Users.ApplicationUser;
using Domain;

namespace ApplicationComment
{
  public class AppCommentResponse
  {
    public Guid Id { get; set; }
    public Guid ParentActivityCommentId { get; set; }
    public AppUser User { get; set; }
    public string Comment { get; set; }
    public List<AppUser> CommentResponseLikes { get; set; }
  }
}