using System;
using System.Collections.Generic;
using Application.Activities.AppCommentLikes;
using Application.Users.ApplicationUser;

namespace ApplicationComment
{
  public class AppComment
  {
    public Guid Id { get; set; }
    public AppUser User { get; set; }
    public string Comment { get; set; }
    public DateTime DateTimeCreated { get; set; }
    public DateTime DateTimeEdited { get; set; }
    public List<AppUser> CommentLikeUsers { get; set; }
  }
}