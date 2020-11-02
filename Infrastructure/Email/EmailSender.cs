using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
  public class EmailSender : IEmailSender
  {
    private readonly IConfiguration _configuration;
    public EmailSender(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public async Task SendEmailAsync(string userEmail, string emailSubject, string message)
    {
      var client = new SendGridClient(_configuration["SendGridKey"]);
      var msg = new SendGridMessage
      {
        From = new EmailAddress("octavian4ik.mitu@gmail.com", "Octavian"),
        Subject = emailSubject,
        PlainTextContent = message,
        HtmlContent = message
      };
      msg.AddTo(new EmailAddress(userEmail));
      msg.SetClickTracking(true, true);

      await client.SendEmailAsync(msg);
    }
  }
}