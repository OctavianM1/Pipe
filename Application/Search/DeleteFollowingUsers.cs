using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search.Inputs
{
  public class DeleteFollowingUsers
  {
    public class Query : IRequest
    {
      public string Input { get; set; }
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
        var input = await _context.SearchFollowingUsers.FirstOrDefaultAsync(s => s.Input == request.Input);
        if (input == null)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { input = "Invalid input" });
        }
        _context.SearchFollowingUsers.Remove(input);

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem deleting input allUsers table");
      }
    }
  }
}