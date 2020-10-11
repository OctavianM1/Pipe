using System;
using System.Collections.Generic;
using Application.Activities.ApplicationRaiting;
using ApplicationActivityLikes;
using ApplicationComment;

namespace ApplicationActivity
{
  public class AppActivity
  {
    public Guid Id { get; set; }
    public Guid UserHostId { get; set; }
    public string UserHostName { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string Subject { get; set; }
    public DateTime DateTimeCreated { get; set; }
    public AppRaiting Raiting { get; set; }
    public AppActivityLikes Likes { get; set; }
    public List<AppComment> Comments { get; set; }
  }
}