using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using ApplicationActivity;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Activities.ApplicationRaiting;
using ApplicationComment;
using ApplicationActivityLikes;
using ApplicationUser;

namespace Application.Activities
{
  public class List
  {
    public class Command : IRequest<List<AppActivity>>
    {
      public string Id { get; set; }
      public string MatchString { get; set; }
    }

    public class Handler : IRequestHandler<Command, List<AppActivity>>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<List<AppActivity>> Handle(Command request, CancellationToken cancellationToken)
      {
        string str = request.MatchString ?? "";
        if (str.Equals(request.Id))
        {
          str = "";
        }
        var guidId = Guid.Parse(request.Id);

        return await _context.Activities.Where(x => x.UserHostId == guidId && (x.Title.Contains(str) || x.Body.Contains(str)))
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
              Rate = ar.Raiting
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
              CountFollowing = ac.User.CountFollowing
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
            }).ToList()
          }).ToList()
        })
        .ToListAsync();
      }
    }
  }
}