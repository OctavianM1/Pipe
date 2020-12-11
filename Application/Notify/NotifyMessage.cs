using System;
using Application.Users.ApplicationUser;

namespace Application.Notify
{
  public class NotifyMessage
  {
    public Guid Id { get; set; }
    public AppUser User { get; set; }
    public string Message { get; set; }
    public DateTime Time { get; set; }
  }
}