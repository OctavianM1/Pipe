using System;
using System.Threading.Tasks;

namespace Application.Notify.SendNotification
{
  public interface ISendNotification
  {
    Task Send(Guid notifierUserId, Guid observableUserId, string message);
  }
}