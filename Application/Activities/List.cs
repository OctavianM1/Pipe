using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.ApplicationUser;
using ApplicationActivity;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Activities.ApplicationRaiting;
using ApplicationComment;
using ApplicationActivityLikes;
using Application.Activities.AppCommentLikes;

namespace Application.Activities
{
  public class List
  {
    public class Query : IRequest<List<AppActivity>>
    {
      public string Id { get; set; }
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
        var guidId = Guid.Parse(request.Id);
        var activities = await _context.Activities.Where(x => x.UserHostId == guidId).ToListAsync();
        var appActivities = new List<AppActivity>();
        foreach (var a in activities)
        {
          var thisActivityRaiting = _context.ActivityRaiting.Where(r => r.ActivityId == a.Id);
          float raiting = 0;
          if (thisActivityRaiting.Count() != 0)
          {
            raiting = thisActivityRaiting.Average(ar => ar.Raiting);
          }
          var usersRaitingIds = await _context.ActivityRaiting.Where(r => r.ActivityId == a.Id).Select(a => a.UserId).ToListAsync();

          List<AppUser> usersRaitings = await _context.Users.Where(u => usersRaitingIds.Contains(u.Id)).Select(u => new AppUser
          {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing
          }).ToListAsync();

          var appRaiting = new AppRaiting { Raiting = raiting, Users = usersRaitings };


          var likes = await _context.ActivityLikes.Where(al => al.ActivityId == a.Id).CountAsync();
          var usersLikesIds = await _context.ActivityLikes.Where(al => al.ActivityId == a.Id).Select(al => al.UserId).ToListAsync();
          List<AppUser> usersLikes = await _context.Users.Where(u => usersLikesIds.Contains(u.Id)).Select(u => new AppUser
          {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            CountFollowers = u.CountFollowers,
            CountFollowing = u.CountFollowing
          }).ToListAsync();
          
          var appLikes = new AppActivityLikes { Likes = likes, Users = usersLikes };

          var commentsDb = await _context.ActivityComments.Where(c => c.ActivityId == a.Id).ToListAsync();
          var comments = new List<AppComment>();
          foreach (var comment in commentsDb)
          {
            var userCommentatorId = _context.ActivityComments.Where(ac => ac.Id == comment.Id).Select(ac => ac.UserId).FirstOrDefault();
            var userCommentator = _context.Users.Where(u => u.Id == userCommentatorId).FirstOrDefault();
            var appUserCommentator = new AppUser
            {
              Id = userCommentator.Id,
              Email = userCommentator.Email,
              Name = userCommentator.Name,
              CountFollowers = userCommentator.CountFollowers,
              CountFollowing = userCommentator.CountFollowing
            };

            var usersCommentLikesIds = await _context.CommentsLikes.Where(com => com.CommentId == comment.Id).Select(com => com.UserId).ToListAsync();
            List<AppUser> appCommentLikeUsers = await _context.Users.Where(u => usersCommentLikesIds.Contains(u.Id)).Select(u => new AppUser
            {
              Id = u.Id,
              Email = u.Email,
              Name = u.Name,
              CountFollowers = u.CountFollowers,
              CountFollowing = u.CountFollowing
            }).ToListAsync();


            comments.Add(new AppComment
            {
              Id = comment.Id,
              User = appUserCommentator,
              Comment = comment.Comment,
              DateTimeCreated = comment.DateTimeCreated,
              DateTimeEdited = comment.DateTimeEdited,
              CommentLikeUsers = appCommentLikeUsers
            });
          }

          appActivities.Add(new AppActivity
          {
            Id = a.Id,
            UserHostId = a.UserHostId,
            UserHostName = _context.Users.Where(x => x.Id == a.UserHostId).Select(u => u.Name).FirstOrDefault(),
            Title = a.Title,
            Subject = a.Subject,
            Body = a.Body,
            DateTimeCreated = a.DateTimeCreated,
            Raiting = appRaiting,
            Likes = appLikes,
            Comments = comments
          });
          appActivities.Add(new AppActivity
          {
            Id = a.Id,
            UserHostId = a.UserHostId,
            UserHostName = _context.Users.Where(x => x.Id == a.UserHostId).Select(u => u.Name).FirstOrDefault(),
            Title = a.Title,
            Subject = a.Subject,
            Body = a.Body,
            DateTimeCreated = a.DateTimeCreated,
            Raiting = appRaiting,
            Likes = appLikes,
            Comments = null
          });
        }
        return appActivities;


        // return activities;
      }
    }
  }
}