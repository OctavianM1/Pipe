using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using ApplicationComment;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
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
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<AppComment> Handle(Command request, CancellationToken cancellationToken)
      {
        var activityComment = new ActivityComment
        {
          Id = Guid.NewGuid(),
          UserId = request.UserId,
          ActivityId = request.ActivityId,
          Comment = request.CommentBody,
          DateTimeCreated = DateTime.Now,
          DateTimeEdited = DateTime.Now
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
            CountFollowing = u.CountFollowing
          }).FirstOrDefault();
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