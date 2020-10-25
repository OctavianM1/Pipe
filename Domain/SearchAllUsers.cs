using System;

namespace Domain
{
  public class SearchAllUsers
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
    public string Input { get; set; }
    public DateTime DateTimeCreated { get; set; }
  }
}