using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Notify;
using Application.Users.ApplicationUser;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class NotificationController : ControllerBase
  {
    private readonly DataContext _context;

    public NotificationController(DataContext context)
    {
      _context = context;
    }

    [HttpPost("all")]
    public async Task<ActionResult<List<NotifyMessage>>> GetAllNotifications(GetAllDto data)
    {
      var guidUserId = Guid.Parse(data.UserId);
      return await _context.Notify.Where(n => n.ObervableUserId == guidUserId)
        .OrderByDescending(n => n.DateTimeCreated)
        .Select(n => new NotifyMessage
        {
          Id = n.Id,
          User = new AppUser
          {
            Id = n.NotifierUser.Id,
            Name = n.NotifierUser.Name,
            CoverImageExtension = n.NotifierUser.CoverImageExtension
          },
          Message = n.Message,
          Time = n.DateTimeCreated
        }).Skip(data.Taken).Take(data.ToTake).ToListAsync();

    }
  }
}