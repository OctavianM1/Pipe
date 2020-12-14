using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class UnSubscribe
  {
    public class Command : IRequest
    {
      public string Email { get; set; }
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
        var subscribedEmail = await _context.SubscriberOnEmailNews.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (subscribedEmail == null)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { Email = "Email is not subscribed" });
        }

        _context.SubscriberOnEmailNews.Remove(subscribedEmail);

        var success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return Unit.Value;
        }
        throw new System.Exception("Problem deleting subscriber from db");
      }
    }
  }
}