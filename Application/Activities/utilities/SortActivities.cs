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
  public static class SortActivities
  {
    public static async Task<List<AppActivity>> SortAsync(this IQueryable<AppActivity> allActivities, string sort, int took, int toTake)
    {
      if (sort == "default")
      {
        return await allActivities.Skip(took).Take(toTake).ToListAsync();
      }
      else if (sort == "raiting-ascending")
      {
        return await allActivities.OrderBy(a => a.Raiting.Raiting).Skip(took).Take(toTake).ToListAsync();
      }
      else if (sort == "raiting-descending")
      {
        return await allActivities.OrderByDescending(a => a.Raiting.Raiting).Skip(took).Take(toTake).ToListAsync();
      }
      else if (sort == "likes-ascending")
      {
        return await allActivities.OrderBy(a => a.Likes.Likes).Skip(took).Take(toTake).ToListAsync();
      }
      else if (sort == "likes-descending")
      {
        return await allActivities.OrderByDescending(a => a.Likes.Likes).Skip(took).Take(toTake).ToListAsync();
      }
      else if (sort == "newest")
      {
        var allActivitiesList = await allActivities.ToListAsync();
        foreach (var a in allActivitiesList)
        {
          a.DateTimeCreatedParsed = DateTime.ParseExact(a.DateTimeCreated, "d/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
        }
        var allActivitiesListOrdered = allActivitiesList.OrderByDescending(a => a.DateTimeCreatedParsed).ToList();
        var allActivitiesTaked = allActivitiesListOrdered.Skip(took).Take(toTake).ToList();

        return allActivitiesTaked;
      }
      else if (sort == "oldest")
      {
        var allActivitiesList = await allActivities.ToListAsync();
        foreach (var a in allActivitiesList)
        {
          a.DateTimeCreatedParsed = DateTime.ParseExact(a.DateTimeCreated, "d/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
        }
        var allActivitiesListOrdered = allActivitiesList.OrderBy(a => a.DateTimeCreatedParsed).ToList();
        var allActivitiesTaked = allActivitiesListOrdered.Skip(took).Take(toTake).ToList();

        return allActivitiesTaked;
      }

      throw new RestException(System.Net.HttpStatusCode.NotFound, new { sort = "Sort was not found" });
    }
  }
}