using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class Login
  {
    public class Query : IRequest<AppUser>
    {
      public string Email { get; set; }
      public string Password { get; set; }
    }

    public class Handler : IRequestHandler<Query, AppUser>
    {
      private readonly DataContext _context;
      private readonly IJwtGeneratorService _jwtGenerator;
      public Handler(DataContext context, IJwtGeneratorService jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _context = context;
      }

      public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.Include(u => u.Activities).FirstOrDefaultAsync(u => u.Email.Equals(request.Email));
        if (user == null)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = "Invalid email" });
        }

        if (user.IsEmailConfirmed == false)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = "Email is not confirmed" });
        }

        var origHashedParts = user.Password.Split('|');
        var origSalt = Convert.FromBase64String(origHashedParts[0]);
        var origHash = origHashedParts[1];

        var pbkdf2 = new Rfc2898DeriveBytes(request.Password, origSalt, 10000);

        byte[] testHash = pbkdf2.GetBytes(20);

        if (Convert.ToBase64String(testHash) != origHash)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { password = "Invalid password" });
        }
        return new AppUser
        {
          Id = user.Id,
          Name = user.Name,
          Email = user.Email,
          CountFollowers = user.CountFollowers,
          CountFollowing = user.CountFollowing,
          Token = _jwtGenerator.CreateToken(user),
          NumberOfActivities = user.Activities.Count(),
          CoverImageExtension = user.CoverImageExtension
        };
      }
    }
  }
}