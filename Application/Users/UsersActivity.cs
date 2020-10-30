using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class UsersActivity
  {
    public class Query : IRequest<AppUsersActivity>
    {
      public string UserHostId { get; set; }
      public string UserVisitorId { get; set; }
    }

    public class Handler : IRequestHandler<Query, AppUsersActivity>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<AppUsersActivity> Handle(Query request, CancellationToken cancellationToken)
      {
        var userHostIdGuid = Guid.Parse(request.UserHostId);
        var userVisitorIdGuid = Guid.Parse(request.UserVisitorId);
        return await _context.Users.Where(u => u.Id == userHostIdGuid).Select(u => new AppUsersActivity
        {
          UserHostId = userHostIdGuid,
          UserVisitorId = userVisitorIdGuid,
          Name = u.Name,
          CountFollowing = u.CountFollowing,
          CountFollows = u.CountFollowers,
          NumberOfActivities = _context.Activities.Count(a => a.UserHostId == userHostIdGuid),
          IsVisitorFollowingHost = _context.Follows.FirstOrDefault(f => f.UserId == userHostIdGuid && f.FollowerId == userVisitorIdGuid) != null
        }).FirstOrDefaultAsync();
      }
    }
  }
}