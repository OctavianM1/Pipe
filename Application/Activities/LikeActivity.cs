using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
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
      public Handler(DataContext context)
      {
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
          return Unit.Value;
        }
        throw new Exception("Error on like");
      }
    }
  }
}