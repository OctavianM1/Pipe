using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class FollowingActivityList
  {
    public class Query : IRequest<List<Activity>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<Activity>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        this._context = context;
      }

      public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
      {
        var followsIds = await _context.Follows.Where(x => x.FollowerId == request.Id)
          .Select(x => x.UserId)
          .ToListAsync();

        var activities = await _context.Activities.Where(a => followsIds.Contains(a.UserHostId))
          .ToListAsync();

        return activities;
      }
    }
  }
}