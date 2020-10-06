using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Users
{
  public class Delete
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
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
        var user = await _context.Users.FindAsync(request.Id);

        if (user == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { user = "Not Found" });
        }

        _context.Remove(user);
        var success = await _context.SaveChangesAsync() > 0;
        if (success) return Unit.Value;
        throw new Exception("Problem deleting user");
      }
    }
  }
}