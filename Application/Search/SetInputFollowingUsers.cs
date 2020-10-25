using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class SetInputFollowingUsers
  {
    public class Command : IRequest
    {
      public Guid UserId { get; set; }
      public string Input { get; set; }
    }
    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {

        var exists = await _context.SearchFollowingUsers.FirstOrDefaultAsync(s => s.UserId == request.UserId && s.Input == request.Input);

        if (exists != null)
        {
          exists.DateTimeCreated = DateTime.Now;
        }
        else
        {
          System.Console.WriteLine(request.Input);
          var existsUser = await _context.Users.FirstOrDefaultAsync(u => u.Name == request.Input);
          if (existsUser == null)
          {
            System.Console.WriteLine("qwe");
            return Unit.Value;
          }
          var dbInput = new SearchFollowingUsers
          {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Input = request.Input,
            DateTimeCreated = DateTime.Now
          };

          _context.SearchFollowingUsers.Add(dbInput);
        }

        var succes = await _context.SaveChangesAsync() > 0;
        if (succes)
        {
          return Unit.Value;
        }
        throw new Exception("Error saving input search all users to db");
      }

    }
  }
}