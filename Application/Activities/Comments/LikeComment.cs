using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Comments
{
  public class LikeComment
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public Guid ActivityId { get; set; }
      public Guid CommentId { get; set; }
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
        var alreadyLiked = _context.CommentLikes.Where(cl => cl.ActivityId == request.ActivityId && cl.UserId == request.UserId && cl.ActivityCommentId == request.CommentId).FirstOrDefault();
        if (alreadyLiked == null)
        {
          var commentLike = new CommentLikes
          {
            Id = Guid.NewGuid(),
            ActivityId = request.ActivityId,
            UserId = request.UserId,
            ActivityCommentId = request.CommentId
          };
          _context.CommentLikes.Add(commentLike);
        }
        else
        {
          _context.CommentLikes.Remove(alreadyLiked);
        }
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem adding like to comment");
      }
    }
  }
}