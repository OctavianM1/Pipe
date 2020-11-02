using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class ConfirmEmail
  {
    public class Query : IRequest
    {
      public string Email { get; set; }
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
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user.IsEmailConfirmed == true)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = "Your email is already confirmed!" });
        }

        user.IsEmailConfirmed = true;

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem saving confirmation email to db");
      }
    }
  }
}