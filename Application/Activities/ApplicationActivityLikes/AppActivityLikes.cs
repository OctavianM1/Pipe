using System.Collections.Generic;
using Application.Users.ApplicationUser;

namespace ApplicationActivityLikes
{
  public class AppActivityLikes
  {
    public int Likes { get; set; } 
    public List<AppUser> Users { get; set; }
  }
} 