using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Notify;
using Application.Notify.SendNotification;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Persistence;

namespace Application.Activities
{
  public class LikeActivity
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
        var like = _context.ActivityLikes.Where(al => al.ActivityId == request.ActivityId && al.UserId == request.UserId).FirstOrDefault();
        if (like == null)
        {
          var likeDb = new ActivityLikes
          {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ActivityId = request.ActivityId
          };
          _context.ActivityLikes.Add(likeDb);
        }
        else
        {
          _context.ActivityLikes.Remove(like);
        }
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          var activityData = _context.Activities.Where(a => a.Id == request.ActivityId)
            .Select(a => new { Title = a.Title, UserId = a.UserHostId })
            .FirstOrDefault();
          var message = like == null ? $"liked your activity - {activityData.Title}" : $"removed like from activity - {activityData.Title}";
          await _sendNotification.Send(request.UserId, activityData.UserId, message);

          return Unit.Value;
        }
        throw new Exception("Error on like");
      }
    }
  }
}