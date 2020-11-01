using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class Detail
  {
    public class Query : IRequest<AppUser>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, AppUser>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.Select(u => new AppUser
        {
          Id = u.Id,
          Email = u.Email,
          Name = u.Name,
          CountFollowers = u.CountFollowers,
          CountFollowing = u.CountFollowing,
          NumberOfActivities = u.Activities.Count()
        }).FirstOrDefaultAsync(u => u.Id == request.Id);
        if (user == null)
        {
          throw new RestException(HttpStatusCode.NotFound, new { user = "User not found" });
        }
        return user;
      }
    }
  }
}