using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Notify;
using Application.Notify.SendNotification;
using Domain;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Rate
{
  public class RateActivity
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public Guid ActivityId { get; set; }
      public float Rate { get; set; }
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
        var isAlreadyRate = _context.ActivityRaiting.Where(ar => ar.ActivityId == request.ActivityId && ar.UserId == request.UserId).FirstOrDefault();
        if (isAlreadyRate == null)
        {
          var newRate = new ActivityRaiting
          {
            Id = Guid.NewGuid(),
            ActivityId = request.ActivityId,
            UserId = request.UserId,
            Raiting = request.Rate
          };
          _context.ActivityRaiting.Add(newRate);
        }
        else
        {
          isAlreadyRate.Raiting = request.Rate;
        }
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          var activityData = await _context.Activities.Where(a => a.Id == request.ActivityId)
            .Select(a => new { Title = a.Title, UserHostId = a.UserHostId })
            .FirstOrDefaultAsync();

          var message = isAlreadyRate == null ? $"changed rate with {request.Rate} stars on your activity - {activityData.Title}" : $"rated with {request.Rate} stars your activity - {activityData.Title}";

          await _sendNotification.Send(request.UserId, activityData.UserHostId, message);
          return Unit.Value;
        }
        throw new Exception("Problem saving rate to db");
      }
    }
  }
}