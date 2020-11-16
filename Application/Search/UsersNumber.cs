using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class UsersNumber
  {
    public class Query : IRequest<List<AppUser>>
    {
      public int NumberOfUsers { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<AppUser>>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<AppUser>> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.Users.Take(request.NumberOfUsers).Select(u => new AppUser
        {
          Id = u.Id,
          Name = u.Name,
          Email = u.Email,
          CountFollowers = u.CountFollowers,
          CountFollowing = u.CountFollowing,
          NumberOfActivities = u.Activities.Count(),
          CoverImageExtension = u.CoverImageExtension
        }).ToListAsync();
      }
    }
  }
}