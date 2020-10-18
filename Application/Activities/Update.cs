using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Update
  {
    public class Command : IRequest
    {
      public string ActivityId { get; set; }
      public string Title { get; set; }
      public string Subject { get; set; }
      public string Body { get; set; }
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
        var activity = await _context.Activities.FirstOrDefaultAsync(a => a.Id == Guid.Parse(request.ActivityId));

        if (activity == null)
        {
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { activity = "Is does't exist" });
        }

        activity.Title = request.Title;
        activity.Subject = request.Subject;
        activity.Body = request.Body;

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem update a activity");
      }
    }
  }
}