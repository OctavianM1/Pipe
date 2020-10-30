using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FollowsAndFollowing
{
  public class Unfollow
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public Guid FollowUserId { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        var follow = await _context.Follows.FirstOrDefaultAsync(f => f.FollowerId == request.FollowUserId && f.UserId == f.UserId);

        var hostUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == follow.UserId);
        hostUser.CountFollowers--;

        var followUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == follow.FollowerId);
        followUser.CountFollowing--;

        _context.Follows.Remove(follow);

        var success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem saving changes in follows table");
      }
    }
  }
}