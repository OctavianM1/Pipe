using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class DeleteInputActivities
  {
    public class Command : IRequest
    {
      public Guid UserHostId { get; set; }
      public Guid UserVisitorId { get; set; }
      public string UserInput { get; set; }
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
        var input = await _context.SearchActivities.FirstOrDefaultAsync(sa => sa.UserHostId == request.UserHostId && sa.UserVisitorId == request.UserVisitorId && sa.Input == request.UserInput);
        if (input == null)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { input = "Invalid input" });
        }
        _context.SearchActivities.Remove(input);

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem deleting input SearchActivities table");
      }
    }
  }
}