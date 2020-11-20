using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class UpdateResponseComment
  {
    public class Command : IRequest<string>
    {
      public Guid ResponseCommentId { get; set; }
      public string NewCommentBody { get; set; }
    }

    public class Handler : IRequestHandler<Command, string>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<string> Handle(Command request, CancellationToken cancellationToken)
      {
        var comment = await _context.CommentResponse.FirstOrDefaultAsync(cr => cr.Id == request.ResponseCommentId);

        comment.Comment = request.NewCommentBody;

        bool success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return comment.Comment;
        }
        throw new Exception("Problem updating comment response");
      }
    }
  }
}