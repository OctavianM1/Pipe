using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Users.ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class UpdatePassword
  {
    public class Command : IRequest<AppUser>
    {
      public Guid UserId { get; set; }
      public string OldPassword { get; set; }
      public string NewPassword { get; set; }
    }

    public class Handler : IRequestHandler<Command, AppUser>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<AppUser> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.Include(u => u.Activities).FirstOrDefaultAsync(u => u.Id == request.UserId);
        if (user == null)
        {
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { user = "Invalid user" });
        }

        var origHashedParts = user.Password.Split('|');
        var origSalt = Convert.FromBase64String(origHashedParts[0]);
        var origHash = origHashedParts[1];

        var pbkdf2 = new Rfc2898DeriveBytes(request.OldPassword, origSalt, 10000);

        byte[] testHash = pbkdf2.GetBytes(20);

        if (Convert.ToBase64String(testHash) != origHash)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { password = "Incorrect old password" });
        }

        var rfc2898DeriveBytes = new Rfc2898DeriveBytes(request.NewPassword, 32)
        {
          IterationCount = 10000
        };
        byte[] hash = rfc2898DeriveBytes.GetBytes(20);
        byte[] salt = rfc2898DeriveBytes.Salt;
        string hashedPassword = Convert.ToBase64String(salt) + "|" + Convert.ToBase64String(hash);

        user.Password = hashedPassword;

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return new AppUser
          {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CountFollowers = user.CountFollowers,
            CountFollowing = user.CountFollowing,
            NumberOfActivities = user.Activities.Count(),
            CoverImageExtension = user.CoverImageExtension
          };
        }
        throw new Exception("Problem to update email");
      }
    }
  }
}