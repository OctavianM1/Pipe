using System.Threading.Tasks;

namespace Application.Notify
{
  public interface INotifyClient
  {
    Task ReceiveMessage(NotifyMessage message);
  }
}