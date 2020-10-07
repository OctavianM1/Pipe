using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
  public class Follows
  {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid FollowerId { get; set; }
  }
}