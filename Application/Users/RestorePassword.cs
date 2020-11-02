using System;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class RestorePassword
  {
    public class Command : IRequest
    {
      public string Email { get; set; }
      public string Password { get; set; }
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
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { email = "Invalid email" });
        }
        var rfc2898DeriveBytes = new Rfc2898DeriveBytes(request.Password, 32)
        {
          IterationCount = 10000
        };
        byte[] hash = rfc2898DeriveBytes.GetBytes(20);
        byte[] salt = rfc2898DeriveBytes.Salt;
        string hashedPassword = Convert.ToBase64String(salt) + "|" + Convert.ToBase64String(hash);

        user.Password = hashedPassword;

        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}