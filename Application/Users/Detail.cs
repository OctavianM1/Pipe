using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
  public class Detail
  {
    public class Query : IRequest<User>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.FindAsync(request.Id);
        if (user == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { user = "User not found" });
        }
        return user;
      }
    }
  }
}