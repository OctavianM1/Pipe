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
  public class AllUsers
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

        var displayedInputs = new List<Input>();
        var id = Guid.Parse(request.UserId);
        var inputs = await _context.SearchAllUsers.Where(s => s.UserId == id && s.Input.StartsWith(request.MatchString))
          .OrderByDescending(s => s.DateTimeCreated)
          .Select(s => new { s.Input, s.Id })
          .Take(10)
          .ToListAsync();
        foreach (var i in inputs)
        {
          displayedInputs.Add(new Input
          {
            Id = i.Input,
            UserInput = i.Input,
            IsVisited = true,
          });
        }


        int countSpaces = 10 - displayedInputs.Count;
        if (countSpaces > 0)
        {
          var onlyInputs = new List<string>();
          foreach (var d in displayedInputs)
          {
            onlyInputs.Add(d.UserInput);
          }
          var usersRemaings = await _context.Users.Where(u => !onlyInputs.Contains(u.Name) && u.Name.StartsWith(request.MatchString))
            .GroupBy(u => u.Name)
            .Take(countSpaces)
            .Select(u => new { Name = u.Key })
            .ToListAsync();
          foreach (var u in usersRemaings)
          {
            displayedInputs.Add(new Input
            {
              Id = u.Name,
              UserInput = u.Name,
              IsVisited = false,
            });
          }

        }
        return displayedInputs;
      }
    }
  }
}