using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<AppUser> Handle(Command request, CancellationToken cancellationToken)
      {
        _context.CommentResponseLikes.Add(new CommentResponseLikes
        {
          Id = Guid.NewGuid(),
          UserId = request.UserId,
          CommentResponseId = request.CommentResponseId
        });

        bool success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
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