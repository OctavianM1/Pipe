using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Search.Inputs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class ActivitiesInputs
  {
    public class Command : IRequest<List<ActivityInput>>
    {
      public Guid UserHostId { get; set; }
      public Guid UserVisitorId { get; set; }
      public string UserInput { get; set; }
    }

    public class Handler : IRequestHandler<Command, List<ActivityInput>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<List<ActivityInput>> Handle(Command request, CancellationToken cancellationToken)
      {
        var str = request.UserInput ?? "";
        var displayedInputs = await _context.SearchActivities.Where(sa => sa.UserHostId == request.UserHostId && sa.UserVisitorId == request.UserVisitorId && sa.Input.StartsWith(str))
        .OrderByDescending(sa => sa.DateTimeAccessed)
        .Select(sa => new ActivityInput
        {
          Id = sa.Id,
          UserHostId = sa.UserHostId,
          UserVisitorId = sa.UserVisitorId,
          UserInput = sa.Input,
          IsVisited = true
        }).Take(10).ToListAsync();

        if (displayedInputs.Count() < 10)
        {
          var inputs = displayedInputs.Select(s => s.UserInput).ToList();
          displayedInputs.AddRange(_context.Activities.Where(a => a.UserHostId == request.UserHostId && a.Title.StartsWith(str) && !inputs.Contains(a.Title) && !inputs.Contains(a.Subject))
          .GroupBy(a => a.Title).Select(a => new ActivityInput
          {
            Id = Guid.NewGuid(),
            UserHostId = request.UserHostId,
            UserVisitorId = request.UserVisitorId,
            UserInput = a.Key,
            IsVisited = false
          }).Take(10 - displayedInputs.Count()));
        }
        return displayedInputs;
      }
    }
  }
}