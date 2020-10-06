using System;

namespace Application.Users.ApplicationUser
{
  public class AppUser
  {
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public int CountFollowers { get; set; }
    public int CountFollowing { get; set; }
    public string Token { get; set; }
  }
}