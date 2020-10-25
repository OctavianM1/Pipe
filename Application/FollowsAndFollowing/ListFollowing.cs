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
  public class ListFollowing
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
        var followsIds = await _context.Follows.Where(x => x.UserId == request.Id)
          .Select(x => x.FollowerId)
          .ToListAsync();
        var follows = await _context.Users.Where(x => followsIds.Contains(x.Id))
          .Select(x => new AppUser { Id = x.Id, Email = x.Email, Name = x.Name, CountFollowers = x.CountFollowers, CountFollowing = x.CountFollowing })
          .ToListAsync();

        if (follows != null)
        {
          return follows;
        }
        throw new Exception("Problem saving changes follows");
      }
    }
  }
}