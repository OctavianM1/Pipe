using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.ApplicationRaiting;
using Application.Users.ApplicationUser;
using ApplicationActivity;
using ApplicationActivityLikes;
using ApplicationComment;
using ApplicationUser;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Detail
  {
    public class Query : IRequest<AppActivity>
    {
      public string activityId { get; set; }
    }

    public class Handler : IRequestHandler<Query, AppActivity>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      } 

      public async Task<AppActivity> Handle(Query request, CancellationToken cancellationToken)
      {
        var guidActivityId = Guid.Parse(request.activityId);
        return await _context.Activities.Where(a => a.Id == guidActivityId).Select(a => new AppActivity
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
            Users = a.ActivityRaiting
            .Select(ar => new AppUserRaiting
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
              NumberOfActivities = ac.User.Activities.Count(),
              CoverImageExtension = ac.User.CoverImageExtension
            },
            Comment = ac.Comment,
            DateTimeCreated = ac.DateTimeCreated,
            DateTimeEdited = ac.DateTimeEdited,
          }).ToList()
        }).FirstOrDefaultAsync();
      }
    }
  }
} 