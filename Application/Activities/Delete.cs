using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
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
        var activity = _context.Activities.Where(a => a.Id == activityId).FirstOrDefault();
        _context.Activities.Remove(activity);
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem saving rate to db");
      }
    }
  }
}