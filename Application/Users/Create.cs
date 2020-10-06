using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Password { get; set; }
      public string Email { get; set; }
      public string Name { get; set; }
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
        if (string.IsNullOrEmpty(request.Email)
          || string.IsNullOrEmpty(request.Password)
          || string.IsNullOrEmpty(request.Name))
        {
          var errors = new Dictionary<string, string>();
          if (string.IsNullOrEmpty(request.Email)) errors["email"] = "Invalid email";
          if (string.IsNullOrEmpty(request.Password)) errors["password"] = "Invalid password";
          if (string.IsNullOrEmpty(request.Name)) errors["name"] = "Invalid name";
          throw new RestException(HttpStatusCode.BadRequest, new { errors });
        }




        var rfc2898DeriveBytes = new Rfc2898DeriveBytes(request.Password, 32)
        {
          IterationCount = 10000
        };
        byte[] hash = rfc2898DeriveBytes.GetBytes(20);
        byte[] salt = rfc2898DeriveBytes.Salt;
        string hashedPassword = Convert.ToBase64String(salt) + "|" + Convert.ToBase64String(hash);
        var user = new User
        {
          Id = request.Id,
          Email = request.Email,
          Password = hashedPassword,
          Name = request.Name,
          CountFollowers = 0,
          CountFollowing = 0
        };
        _context.Users.Add(user);
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