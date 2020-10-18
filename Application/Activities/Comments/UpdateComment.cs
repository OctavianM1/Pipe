using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class UpdateComment
  {
    public class Command : IRequest
    {
      public string Id { get; set; }
      public string CommentBody { get; set; }
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
        var comment = await _context.ActivityComments.FirstOrDefaultAsync(ac => ac.Id == Guid.Parse(request.Id));

        comment.Comment = request.CommentBody;
        comment.DateTimeEdited = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

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