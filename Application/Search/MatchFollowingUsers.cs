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
  public class MatchFollowingUsers
  {
    public class Command : IRequest<List<AppUser>>
    {
      public string MatchString { get; set; }
    }
    public class Handler : IRequestHandler<Command, List<AppUser>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<List<AppUser>> Handle(Command request, CancellationToken cancellationToken)
      {
        return await _context.Users.Where(u => u.Name.StartsWith(request.MatchString)).Select(u => new AppUser
        {
          Id = u.Id,
          Name = u.Name,
          Email = u.Email,
          CountFollowers = u.CountFollowers,
          CountFollowing = u.CountFollowing,
          NumberOfActivities = _context.Activities.Count(a => a.UserHostId == u.Id)
        }).ToListAsync();
      }
    }
  }
}