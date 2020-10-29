using System;
using System.Collections.Generic;

namespace Domain
{
  public class Activity
  {
    public Guid Id { get; set; }
    public Guid UserHostId { get; set; }
    public virtual User UserHost { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string Subject { get; set; }
    public string DateTimeCreated { get; set; }
    public virtual ICollection<ActivityRaiting> ActivityRaiting { get; set; }
    public virtual ICollection<ActivityComment> ActivityComment { get; set; }
    public virtual ICollection<ActivityLikes> ActivityLikes{ get; set; }
  }
}