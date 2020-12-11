using Microsoft.AspNetCore.SignalR;

namespace Application.Notify
{
  public class NotifyHub : Hub<INotifyClient>  { }
}