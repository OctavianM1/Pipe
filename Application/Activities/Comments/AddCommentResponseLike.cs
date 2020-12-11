using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Notify.SendNotification;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class AddCommentResponseLike
  {
    public class Command : IRequest<AppUser>
    {
      public Guid UserId { get; set; }
      public Guid CommentResponseId { get; set; }
    }

    public class Handler : IRequestHandler<Command, AppUser>
    {
      private readonly DataContext _context;
      private readonly ISendNotification _sendNotification;
      public Handler(DataContext context, ISendNotification sendNotification)
      {
        _sendNotification = sendNotification;
        _context = context;
      }

      public async Task<AppUser> Handle(Command request, CancellationToken cancellationToken)
      {
        var like = await _context.CommentResponseLikes.Where(cr => cr.CommentResponseId == request.CommentResponseId).FirstOrDefaultAsync();

        if (like == null)
        {
          _context.CommentResponseLikes.Add(new CommentResponseLikes
          {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            CommentResponseId = request.CommentResponseId
          });
        }
        else
        {
          _context.CommentResponseLikes.Remove(like);
        }

        bool success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          var comment = await _context.CommentResponse.Where(cr => cr.Id == request.CommentResponseId)
            .Select(cr => new { Comment = cr.Comment, UserId = cr.UserId })
            .FirstOrDefaultAsync();

          var message = like == null ? $"liked your response comment - {comment.Comment}" : $"removed like from your response comment - {comment.Comment}";
          await _sendNotification.Send(request.UserId, comment.UserId, message);
          return await _context.Users.Select(u => new AppUser
          {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing,
            CoverImageExtension = u.CoverImageExtension
          }).FirstOrDefaultAsync(u => u.Id == request.UserId);
        }
        throw new Exception("Problem adding comment response like");


      }
    }
  }
}