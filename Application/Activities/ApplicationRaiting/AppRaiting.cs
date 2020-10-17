using System.Collections.Generic;
using ApplicationUser;

namespace Application.Activities.ApplicationRaiting
{
  public class AppRaiting
  {
    public double Raiting { get; set; }
    public List<AppUserRaiting> Users { get; set; } 
  }
}