using System;

namespace Domain
{
  public class ActivityRaiting
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ActivityId { get; set; }
    public float Raiting { get; set; }
  }
}