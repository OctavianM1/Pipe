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
    public class Query : IRequest<List<AppUser>>
    {
      public string MatchString { get; set; }
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
        var users = new List<AppUser>();
        var usersDb = await _context.Users.Where(u => u.Name.StartsWith(request.MatchString)).ToListAsync();
        foreach (var u in usersDb)
        {
          users.Add(new AppUser
          {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing,
          });
        }
        return users;
      }
    }
  }
}