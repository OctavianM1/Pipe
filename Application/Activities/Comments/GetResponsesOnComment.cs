using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using ApplicationComment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Comments
{
  public class GetResponsesOnComment
  {
    public class Query : IRequest<List<AppCommentResponse>>
    {
      public Guid commentId { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<AppCommentResponse>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<AppCommentResponse>> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.CommentResponse.Where(cr => cr.ParentActivityCommentId == request.commentId).Select(cr => new AppCommentResponse
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
    }
  }
}