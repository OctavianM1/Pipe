using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Rate
{
  public class RateActivity
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public Guid ActivityId { get; set; }
      public float Rate { get; set; }
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
        var isAlreadyRate = _context.ActivityRaiting.Where(ar => ar.ActivityId == request.ActivityId && ar.UserId == request.UserId).FirstOrDefault();
        if (isAlreadyRate == null)
        {
          var newRate = new ActivityRaiting
          {
            Id = Guid.NewGuid(),
            ActivityId = request.ActivityId,
            UserId = request.UserId,
            Raiting = request.Rate
          };
          _context.ActivityRaiting.Add(newRate);
        }
        else
        {
          isAlreadyRate.Raiting = request.Rate;
        }
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