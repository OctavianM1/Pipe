using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FollowsAndFollowing
{
  public class ListFollowers
  {
    public class Query : IRequest<List<AppUser>>
    {
      public Guid Id { get; set; }
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
        return await _context.Follows.Where(f => f.UserId == request.Id).Select(f => new AppUser
        {
          Id = f.FollowerId,
          Name = f.Follower.Name,
          Email = f.Follower.Email,
          CountFollowers = f.Follower.CountFollowers,
          CountFollowing = f.Follower.CountFollowing,
          NumberOfActivities = f.Follower.Activities.Count()
        }).ToListAsync();
      }
    }
  }
}