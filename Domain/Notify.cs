using System;

namespace Domain
{
  public class Notify
  {
    public Guid Id { get; set; }
    public Guid NotifierUserId { get; set; }
    public virtual User NotifierUser { get; set; }
    public Guid ObervableUserId { get; set; }
    public virtual User ObervableUser { get; set; }
    public string Message { get; set; }
    public DateTime DateTimeCreated { get; set; }
  }
}