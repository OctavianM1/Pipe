using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using Microsoft.AspNetCore.SignalR;
using Persistence;

namespace Application.Notify.SendNotification
{
  public class SendNotification : ISendNotification
  {
    private readonly DataContext _context;
    private readonly IHubContext<NotifyHub, INotifyClient> _notifyHub;

    public SendNotification(DataContext context, IHubContext<NotifyHub, INotifyClient> notifyHub)
    {
      _context = context;
      _notifyHub = notifyHub;
    }
    public async Task Send(Guid notifierUserId, Guid observableUserId, string message)
    {
      var notifyId = Guid.NewGuid();
      var user = _context.Users.Where(u => u.Id == notifierUserId).Select(u => new AppUser
      {
        Id = u.Id,
        Name = u.Name,
        CoverImageExtension = u.CoverImageExtension,
      }).FirstOrDefault();

      var notify = new NotifyMessage
      {
        Id = notifyId,
        User = user,
        ObservableUsersIds = new List<Guid> { observableUserId },
        Message = message,
        Time = DateTime.Now
      };

      _context.Notify.Add(new Domain.Notify
      {
        Id = notifyId,
        Message = message,
        NotifierUserId = notifierUserId,
        ObervableUserId = observableUserId,
        DateTimeCreated = DateTime.Now
      });

      bool successNotify = await _context.SaveChangesAsync() > 0;

      if (successNotify)
      {
        await _notifyHub.Clients.All.ReceiveMessage(notify);
      }
    }
  }
}