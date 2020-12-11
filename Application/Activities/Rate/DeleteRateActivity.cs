using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Notify.SendNotification;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Rate
{
  public class DeleteRateActivity
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public Guid ActivityId { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ISendNotification _sendNotification;
      public Handler(DataContext context, ISendNotification sendNotification)
      {
        _sendNotification = sendNotification;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var rate = await _context.ActivityRaiting.Where(ar => ar.ActivityId == request.ActivityId && ar.UserId == request.UserId).FirstOrDefaultAsync();
        _context.ActivityRaiting.Remove(rate);
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          var activityData = await _context.Activities.Where(a => a.Id == request.ActivityId)
            .Select(a => new { Title = a.Title, UserHostId = a.UserHostId })
            .FirstOrDefaultAsync();

          var message = $"removed raiting on activity - {activityData.Title}";
          await _sendNotification.Send(request.UserId, activityData.UserHostId, message);
          return Unit.Value;
        }
        throw new Exception("Problem saving rate to db");
      }
    }
  }
}