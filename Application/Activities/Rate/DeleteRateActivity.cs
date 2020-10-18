using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities.Rate
{
  public class DeleteRateActivity
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
        var rate = _context.ActivityRaiting.Where(ar => ar.ActivityId == request.ActivityId && ar.UserId == request.UserId).FirstOrDefault();
        _context.ActivityRaiting.Remove(rate);
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