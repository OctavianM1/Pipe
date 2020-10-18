using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Delete
  {
    public class Query : IRequest
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Query>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<Unit> Handle(Query request, CancellationToken cancellationToken)
      {
        var activityId = Guid.Parse(request.Id);

        var commentLikes = await _context.CommentLikes.Where(cl => cl.ActivityId == activityId).ToListAsync();
        _context.RemoveRange(commentLikes);
        await _context.SaveChangesAsync();

        var activityComments = await _context.ActivityComments.Where(cl => cl.ActivityId == activityId).ToListAsync();
        _context.RemoveRange(activityComments);
        await _context.SaveChangesAsync();

        var activityRaitings = await _context.ActivityRaiting.Where(cl => cl.ActivityId == activityId).ToListAsync();
        _context.RemoveRange(activityRaitings);
        await _context.SaveChangesAsync();

        var activityLikes = await _context.ActivityLikes.Where(cl => cl.ActivityId == activityId).ToListAsync();
        _context.RemoveRange(activityLikes);
        await _context.SaveChangesAsync();

        var activity = await _context.Activities.Where(a => a.Id == activityId).FirstOrDefaultAsync();
        _context.Activities.Remove(activity);

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem delete a activity to db");
      }
    }
  }
}