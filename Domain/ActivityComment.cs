using System;

namespace Domain
{
  public class ActivityComment
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }
    public string Comment { get; set; }
    public string DateTimeCreated { get; set; }
    public string DateTimeEdited { get; set; }
  }
}