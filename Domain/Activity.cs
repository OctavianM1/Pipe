using System;

namespace Domain
{
  public class Activity
  {
    public Guid Id { get; set; }
    public Guid UserHostId { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string Subject { get; set; }
    public DateTime DateTimeCreated { get; set; }

  }
}