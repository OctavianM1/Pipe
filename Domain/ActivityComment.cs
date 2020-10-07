using System;

namespace Domain
{
  public class ActivityComment
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ActivityId { get; set; }
    public string Comment { get; set; }
    public DateTime DateTimeCreated { get; set; }
    public DateTime DateTimeEdited { get; set; }
  }
}