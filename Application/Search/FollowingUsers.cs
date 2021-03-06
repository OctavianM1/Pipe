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
  public class FollowingUsers
  {
    public class Command : IRequest<List<Input>>
    {
      public string UserId { get; set; }
      public string MatchString { get; set; }
    }
    public class Handler : IRequestHandler<Command, List<Input>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<Input>> Handle(Command request, CancellationToken cancellationToken)
      {
        var id = Guid.Parse(request.UserId);
        var displayedInputs = await _context.SearchFollowingUsers.Where(sf => sf.UserId == id && sf.Input.StartsWith(request.MatchString))
        .OrderByDescending(sf => sf.DateTimeCreated)
        .Select(sf => new Input
        {
          Id = sf.Input,
          UserInput = sf.Input,
          IsVisited = true
        }).Take(10).ToListAsync();

        if (displayedInputs.Count() < 10)
        {
          var onlyInputs = displayedInputs.Select(d => d.UserInput);
          displayedInputs.AddRange(await _context.Follows.Where(u => u.User.Name.StartsWith(request.MatchString) && u.FollowerId == id && !onlyInputs.Contains(u.User.Name))
          .GroupBy(u => u.User.Name)
          .Select(u => new Input
          {
            Id = u.Key,
            UserInput = u.Key,
            IsVisited = false
          }).Take(10 - displayedInputs.Count()).ToListAsync());
        }

        return displayedInputs;
      }
    }
  }
}
