using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class DeleteResponseComment
  {
    public class Query : IRequest
    {
      public Guid ResponseCommentId { get; set; }
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
        var comment = await _context.CommentResponse.FirstOrDefaultAsync(cr => cr.Id == request.ResponseCommentId);

        if (comment == null)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { comment = "Invalid response comment id" });
        }

        _context.CommentResponse.Remove(comment);

        bool success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return Unit.Value;
        }
        
        throw new Exception("Problem deleting response comment");
      }
    }
  }
}