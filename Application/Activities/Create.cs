using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid UserHostId { get; set; }
      public string Title { get; set; }
      public string Body { get; set; }
      public string Subject { get; set; }
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
        var activity = new Activity
        {
          Id = Guid.NewGuid(),
          UserHostId = request.UserHostId,
          Title = request.Title,
          Body = request.Body,
          Subject = request.Subject,
          DateTimeCreated = DateTime.Now
        };

        _context.Activities.Add(activity);
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem saving changes");
      }
    }
  }
}