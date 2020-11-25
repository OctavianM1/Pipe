using System.Threading.Tasks;

namespace Application.Interfaces
{
  public interface IEmailSenderService
  {
    Task SendEmailAsync(string userEmail, string emailSubject, string message);
  }
}