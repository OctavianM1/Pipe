using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Users.ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class UpdateName
  {
    public class Command : IRequest<AppUser>
    {
      public Guid UserId { get; set; }
      public string NewName { get; set; }
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
        user.Name = request.NewName;

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
            NumberOfActivities = user.Activities.Count()
          };
        }
        throw new Exception("Problem to update email");
      }
    }
  }
}