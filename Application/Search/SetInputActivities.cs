using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using ApplicationActivity;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class SetInputActivities
  {
    public class Command : IRequest<List<AppActivity>>
    {
      public Guid UserHostId { get; set; }
      public Guid UserVisitorId { get; set; }
      public string UserInput { get; set; }
    }

    public class Handler : IRequestHandler<Command, List<AppActivity>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<List<AppActivity>> Handle(Command request, CancellationToken cancellationToken)
      {
        var exists = await _context.SearchActivities.FirstOrDefaultAsync(sa => sa.Input == request.UserInput && sa.UserVisitorId == request.UserVisitorId && sa.UserHostId == request.UserHostId);
        if (exists != null)
        {
          exists.DateTimeAccessed = DateTime.Now;
        }
        else
        {
          var newInput = new SearchActivities
          {
            Id = Guid.NewGuid(),
            DateTimeAccessed = DateTime.Now,
            UserHostId = request.UserHostId,
            UserVisitorId = request.UserVisitorId,
            Input = request.UserInput
          };
          _context.SearchActivities.Add(newInput);
        }

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          var handler = new List.Handler(_context);
          return await handler.Handle(new List.Command { Id = request.UserHostId.ToString(), MatchString = request.UserInput }, cancellationToken);
        }
        throw new Exception("Error saving input activities to db");
      }
    }
  }
}