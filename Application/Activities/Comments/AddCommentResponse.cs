using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using ApplicationComment;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class AddCommentResponse
  {
    public class Command : IRequest<List<AppCommentResponse>>
    {
      public Guid ParentActivityCommentId { get; set; }
      public Guid UserId { get; set; }
      public string Comment { get; set; }
    }

    public class Handler : IRequestHandler<Command, List<AppCommentResponse>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<AppCommentResponse>> Handle(Command request, CancellationToken cancellationToken)
      {
        _context.CommentResponse.Add(new CommentResponse
        {
          Id = Guid.NewGuid(),
          ParentActivityCommentId = request.ParentActivityCommentId,
          Comment = request.Comment,
          UserId = request.UserId
        });

        bool success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
          return await _context.CommentResponse.Where(cr => cr.ParentActivityCommentId == request.ParentActivityCommentId).Select(cr => new AppCommentResponse
          {
            Id = cr.Id,
            ParentActivityCommentId = cr.ParentActivityCommentId,
            User = new AppUser
            {
              Id = cr.User.Id,
              Name = cr.User.Name,
              Email = cr.User.Email,
              CountFollowers = cr.User.CountFollowers,
              CountFollowing = cr.User.CountFollowing,
              CoverImageExtension = cr.User.CoverImageExtension,
              IsSubscribedToEmails = cr.User.IsEmailConfirmed
            },
            Comment = cr.Comment,
            CommentResponseLikes = cr.CommentResponseLikes.Where(crl => crl.CommentResponseId == cr.Id).Select(x => new AppUser
            {
              Id = x.UserId,
              Name = x.User.Name,
              Email = x.User.Email,
              CountFollowers = x.User.CountFollowers,
              CountFollowing = x.User.CountFollowing,
              CoverImageExtension = x.User.CoverImageExtension,
              IsSubscribedToEmails = x.User.IsEmailConfirmed
            }).ToList()
          }).ToListAsync();
        }
        throw new Exception("Problem adding response comment");
      }
    }
  }
}