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
      public string userId { get; set; }
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
        var activity = await _context.Activities.FirstOrDefaultAsync(a => a.Id == Guid.Parse(request.activityId));

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(request.userId));

        var raitingUserIds = await _context.ActivityRaiting.Where(ar => ar.UserId == user.Id && ar.ActivityId == activity.Id).Select(ar => ar.UserId).ToListAsync();

        var raitingUsers = await _context.Users.Where(u => raitingUserIds.Contains(u.Id)).ToListAsync();

        var appUsersRaiting = new List<AppUserRaiting>();
        foreach (var u in raitingUsers)
        {
          appUsersRaiting.Add(new AppUserRaiting
          {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Rate = await _context.ActivityRaiting.Where(ar => ar.UserId == u.Id && ar.ActivityId == activity.Id).Select(ar => ar.Raiting).FirstOrDefaultAsync()
          });
        }

        var raitingDb = await _context.ActivityRaiting.Where(ar => ar.ActivityId == activity.Id).ToListAsync();
        float raiting = 0;
        if (raitingDb.Count() > 0)
        {
          raiting = raitingDb.Average(rdb => rdb.Raiting);
        }

        var raitingApp = new AppRaiting
        {
          Raiting = raiting,
          Users = appUsersRaiting
        };

        var likeUsersIds = await _context.ActivityLikes.Where(al => al.ActivityId == activity.Id).Select(al => al.UserId).ToListAsync();

        var likeUsers = await _context.Users.Where(u => likeUsersIds.Contains(u.Id)).ToListAsync();

        var appLikeUsers = new List<AppUser>();
        foreach(var u in likeUsers)
        {
          appLikeUsers.Add(new AppUser
          {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing
          });
        }

        var appActivityLikes = new AppActivityLikes
        {
          Likes = likeUsersIds.Count,
          Users = appLikeUsers
        };

        var comments = new List<AppComment>();
        var commentsDb = await _context.ActivityComments.Where(ac => ac.ActivityId == activity.Id).ToListAsync();
        foreach(var comment in commentsDb)
        {
          var commentUserDb = await _context.Users.FirstOrDefaultAsync(u => u.Id == comment.UserId);
          var commentUser = new AppUser
          {
            Id = commentUserDb.Id,
            Name = commentUserDb.Name,
            Email = commentUserDb.Email,
            CountFollowers = commentUserDb.CountFollowers,
            CountFollowing = commentUserDb.CountFollowing
          };

          var commentLikeUserIds = await _context.CommentLikes.Where(cl => cl.CommentId == comment.Id).Select(cl => cl.UserId).ToListAsync();
          var commentLikeUsers = await _context.Users.Where(u => commentLikeUserIds.Contains(u.Id)).ToListAsync();

          var likeCommentUsers = new List<AppUser>();
          foreach(var u in commentLikeUsers)
          {
            likeCommentUsers.Add(new AppUser
            {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing
            });
          }

          comments.Add(new AppComment
          {
            Id = comment.Id,
            User = commentUser,
            Comment = comment.Comment,
            DateTimeCreated = comment.DateTimeCreated,
            DateTimeEdited = comment.DateTimeEdited,
            CommentLikeUsers = likeCommentUsers
          });
        }

        return new AppActivity
        {
          Id = activity.Id,
          UserHostId = user.Id,
          UserHostName = user.Name,
          Title = activity.Title,
          Body = activity.Body,
          Subject = activity.Subject,
          DateTimeCreated = activity.DateTimeCreated,
          Likes = appActivityLikes,
          Comments = comments,
          Raiting = raitingApp
        };        
      }
    }
  }
}