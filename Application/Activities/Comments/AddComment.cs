using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Notify.SendNotification;
using Application.Users.ApplicationUser;
using ApplicationComment;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class AddComment
  {
    public class Command : IRequest<AppComment>
    {
      public Guid UserId { get; set; }
      public Guid ActivityId { get; set; }
      public string CommentBody { get; set; }
    }

    public class Handler : IRequestHandler<Command, AppComment>
    {
      private readonly DataContext _context;
      private readonly ISendNotification _sendNotification;
      public Handler(DataContext context, ISendNotification sendNotification)
      {
        _sendNotification = sendNotification;
        _context = context;
      }

      public async Task<AppComment> Handle(Command request, CancellationToken cancellationToken)
      {
        var activityComment = new ActivityComment
        {
          Id = Guid.NewGuid(),
          UserId = request.UserId,
          ActivityId = request.ActivityId,
          Comment = request.CommentBody,
          DateTimeCreated = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
          DateTimeEdited = DateTime.Now.ToString("dd/MM/yyyy HH:mm")
        };

        _context.ActivityComments.Add(activityComment);
        var success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          AppUser user = _context.Users.Where(u => u.Id == activityComment.UserId).Select(u => new AppUser
          {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing,
            NumberOfActivities = u.Activities.Count(),
            CoverImageExtension = u.CoverImageExtension
          }).FirstOrDefault();

          var activityData = await _context.Activities.Where(a => a.Id == request.ActivityId)
            .Select(a => new { Title = a.Title, UserHostId = a.UserHostId })
            .FirstOrDefaultAsync();

          var message = $"added new comment to your activity - {activityData.Title}";
          await _sendNotification.Send(request.UserId, activityData.UserHostId, message);

          return new AppComment
          {
            Id = activityComment.Id,
            User = user,
            Comment = activityComment.Comment,
            DateTimeCreated = activityComment.DateTimeCreated,
            DateTimeEdited = activityComment.DateTimeEdited,
            CommentLikeUsers = new List<AppUser>()
          };
        }

        throw new Exception("Problem saving changes");
      }
    }

  }
}