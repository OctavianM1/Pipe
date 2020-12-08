using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using ApplicationActivity;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities.utilities
{
  public static class ManipulateActivities
  {
    public static async Task<List<AppActivity>> SortAsync(this IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      switch (sort)
      {
        case "default":
          return await SortDefault(allActivities, sort, took, toTake);

        case "raiting-ascending":
          return await SortRaitingAscending(allActivities, sort, took, toTake);

        case "raiting-descending":
          return await SortRaitingDescending(allActivities, sort, took, toTake);

        case "likes-ascending":
          return await SortLikesAscending(allActivities, sort, took, toTake);

        case "likes-descending":
          return await SortLikesDescending(allActivities, sort, took, toTake);

        case "newest":
          return await SortNewest(allActivities, sort, took, toTake);

        case "oldest":
          return await SortOldest(allActivities, sort, took, toTake);

        default:
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { sort = "Sort was not found" });
      }
    }

    private static async Task<List<AppActivity>> SortDefault(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      return await allActivities.Skip(took)
        .Take(toTake)
        .ToListAsync();
    }
    private static async Task<List<AppActivity>> SortRaitingAscending(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      return await allActivities.OrderBy(a => a.Raiting.Raiting)
        .Skip(took)
        .Take(toTake)
        .ToListAsync();
    }
    private static async Task<List<AppActivity>> SortRaitingDescending(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      return await allActivities.OrderByDescending(a => a.Raiting.Raiting)
        .Skip(took)
        .Take(toTake)
        .ToListAsync();
    }
    private static async Task<List<AppActivity>> SortLikesAscending(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      return await allActivities.OrderBy(a => a.Likes.Likes)
        .Skip(took)
        .Take(toTake)
        .ToListAsync();
    }
    private static async Task<List<AppActivity>> SortLikesDescending(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      return await allActivities.OrderByDescending(a => a.Likes.Likes)
        .Skip(took)
        .Take(toTake)
        .ToListAsync();
    }
    private static async Task<List<AppActivity>> SortNewest(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      var allActivitiesList = await allActivities.ToListAsync();
      foreach (var a in allActivitiesList)
      {
        a.DateTimeCreatedParsed = DateTime.ParseExact(a.DateTimeCreated, "d/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
      }
      var allActivitiesListOrdered = allActivitiesList.OrderByDescending(a => a.DateTimeCreatedParsed).ToList();

      var allActivitiesTaked = allActivitiesListOrdered.Skip(took)
        .Take(toTake)
        .ToList();

      return allActivitiesTaked;
    }
    private static async Task<List<AppActivity>> SortOldest(IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      var allActivitiesListOldest = await allActivities.ToListAsync();
      foreach (var a in allActivitiesListOldest)
      {
        a.DateTimeCreatedParsed = DateTime.ParseExact(a.DateTimeCreated, "d/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
      }
      var allActivitiesListOldestOrdered = allActivitiesListOldest.OrderBy(a => a.DateTimeCreatedParsed).ToList();

      var allActivitiesTakedOldest = allActivitiesListOldestOrdered.Skip(took)
        .Take(toTake)
        .ToList();

      return allActivitiesTakedOldest;
    }

    public static IQueryable<AppActivity> Filter(this IQueryable<AppActivity> allActivities, double starsMin, int starsMax, string title, string subject)
    {
      return allActivities.Where(a => a.Raiting.Raiting >= starsMin && a.Raiting.Raiting <= starsMax && a.Title.Contains(title, StringComparison.InvariantCultureIgnoreCase) && a.Subject.Contains(subject, StringComparison.InvariantCultureIgnoreCase));
    }
  }
}