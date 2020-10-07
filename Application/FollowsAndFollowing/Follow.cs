using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.FollowsAndFollowing
{
  public class Follow
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
        var newFollow = new Follows
        {
          UserId = request.UserId,
          FollowerId = request.FollowUserId
        };

        _context.Follows.Add(newFollow);

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