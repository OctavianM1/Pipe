using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Search.Inputs;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class SetInputFollowsUsers
  {
    public class Command : IRequest<List<AppUser>>
    {
      public Guid UserId { get; set; }
      public string Input { get; set; }
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
        var usersIds = await _context.Follows.Where(f => f.UserId == request.UserId).Select(f => f.FollowerId).ToListAsync();

        var exists = await _context.SearchFollowsUsers.FirstOrDefaultAsync(s => s.UserId == request.UserId && s.Input == request.Input);

        if (exists != null)
        {
          exists.DateTimeCreated = DateTime.Now;
        }
        else
        {
          var existsUser = await _context.Users.FirstOrDefaultAsync(u => u.Name == request.Input);
          if (existsUser == null)
          {
            return await _context.Users.Where(u => usersIds.Contains(u.Id) && u.Name.StartsWith(request.Input))
              .Select(u => new AppUser
              {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                CountFollowers = u.CountFollowers,
                CountFollowing = u.CountFollowing,
                NumberOfActivities = u.Activities.Count(),
                CoverImageExtension = u.CoverImageExtension
              })
              .ToListAsync();
          }
          var dbInput = new SearchFollowsUsers
          {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Input = request.Input,
            DateTimeCreated = DateTime.Now
          };

          _context.SearchFollowsUsers.Add(dbInput);
        }

        var succes = await _context.SaveChangesAsync() > 0;
        if (succes)
        {
          return await _context.Users.Where(u => usersIds.Contains(u.Id) && u.Name.StartsWith(request.Input))
            .Select(u => new AppUser
            {
              Id = u.Id,
              Name = u.Name,
              Email = u.Email,
              CountFollowers = u.CountFollowers,
              CountFollowing = u.CountFollowing,
              NumberOfActivities = u.Activities.Count(),
              CoverImageExtension = u.CoverImageExtension
            })
            .ToListAsync();
        }
        throw new Exception("Error saving input search all users to db");

      }
    }
  }
}