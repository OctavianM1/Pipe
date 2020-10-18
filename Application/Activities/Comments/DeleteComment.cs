using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class DeleteComment
  {
    public class Query : IRequest
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Query>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }
      public async Task<Unit> Handle(Query request, CancellationToken cancellationToken)
      {
        var comment = await _context.ActivityComments.FirstOrDefaultAsync(ac => ac.Id == Guid.Parse(request.Id));
        _context.ActivityComments.Remove(comment);

        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Problem update a activity");
      }
    }
  }
}