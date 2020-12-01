using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.ApplicationRaiting;
using Application.Errors;
using Application.Users.ApplicationUser;
using ApplicationActivity;
using ApplicationActivityLikes;
using ApplicationComment;
using ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Activities.utilities;

namespace Application.Activities
{
  public class LikedActivities
  {
    public class Query : IRequest<List<AppActivity>>
    {
      public Guid UserId { get; set; }
      public int Took { get; set; }
      public int ToTake { get; set; }
      public string SortBy { get; set; }
    }

    public class Handler : IRequestHandler<Query, List<AppActivity>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<AppActivity>> Handle(Query request, CancellationToken cancellationToken)
      {
        var activitiesIds = await _context.ActivityLikes.Where(al => al.UserId == request.UserId).Select(al => al.ActivityId).ToListAsync();

        var allActivities = _context.Activities.Where(a => activitiesIds.Contains(a.Id))
        .Select(a => new AppActivity
        {
          Id = a.Id,
          UserHostId = a.UserHostId,
          UserHostName = a.UserHost.Name,
          Title = a.Title,
          Subject = a.Subject,
          Body = a.Body,
          DateTimeCreated = a.DateTimeCreated,
          Raiting = new AppRaiting
          {
            Users = a.ActivityRaiting.Select(ar => new AppUserRaiting
            {
              Id = ar.UserId,
              Name = ar.User.Name,
              Email = ar.User.Email,
              Rate = ar.Raiting,
              CoverImageExtension = ar.User.CoverImageExtension
            }).ToList(),
            Raiting = a.ActivityRaiting.Average(ar => ar.Raiting)
          },
          Likes = new AppActivityLikes
          {
            Likes = a.ActivityLikes.Count(),
            Users = a.ActivityLikes.Select(al => new AppUser
            {
              Id = al.User.Id,
              Name = al.User.Name,
              Email = al.User.Email,
              CountFollowers = al.User.CountFollowers,
              CountFollowing = al.User.CountFollowing,
              NumberOfActivities = al.User.Activities.Count(),
              CoverImageExtension = al.User.CoverImageExtension
            }).ToList()
          },
          Comments = a.ActivityComment.Select(ac => new AppComment
          {
            Id = ac.Id,
            User = new AppUser
            {
              Name = ac.User.Name,
              Email = ac.User.Email,
              Id = ac.UserId,
              CountFollowers = ac.User.CountFollowers,
              CountFollowing = ac.User.CountFollowing,
              CoverImageExtension = ac.User.CoverImageExtension
            },
            Comment = ac.Comment,
            DateTimeCreated = ac.DateTimeCreated,
            DateTimeEdited = ac.DateTimeEdited,
            CommentLikeUsers = ac.CommentLikes.Select(cl => new AppUser
            {
              Id = cl.UserId,
              Name = cl.User.Name,
              Email = cl.User.Email,
              CountFollowing = cl.User.CountFollowing,
              CountFollowers = cl.User.CountFollowers,
              NumberOfActivities = cl.User.Activities.Count(),
              CoverImageExtension = cl.User.CoverImageExtension
            }).ToList(),
            NumberOfResponses = ac.CommentResponses.Count()
          }).ToList()
        });

        return await allActivities.SortAsync(request.SortBy, request.Took, request.ToTake);
      }
    }
  }
}