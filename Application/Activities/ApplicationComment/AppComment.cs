using System;
using System.Collections.Generic;
using Application.Users.ApplicationUser;

namespace ApplicationComment
{
  public class AppComment
  {
    public Guid Id { get; set; }
    public AppUser User { get; set; }
    public string Comment { get; set; }
    public string DateTimeCreated { get; set; }
    public string DateTimeEdited { get; set; }
    public List<AppUser> CommentLikeUsers { get; set; }
    public int NumberOfResponses { get; set; }
  }
}