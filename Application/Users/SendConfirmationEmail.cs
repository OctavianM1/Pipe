using System.Threading;
using System.Threading.Tasks;
using Application.Emails;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class SendConfirmationEmail
  {
    public class Query : IRequest<string>
    {
      public string Email { get; set; }
    }
    public class Handler : IRequestHandler<Query, string>
    {
      private readonly DataContext _context;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly IEmailSender _sender;
      public Handler(DataContext context, IEmailSender sender, IJwtGenerator jwtGenerator)
      {
        _sender = sender;
        _jwtGenerator = jwtGenerator;
        _context = context;
      }

      public async Task<string> Handle(Query request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
          throw new RestException(System.Net.HttpStatusCode.NotFound, new { email = $"{request.Email} do not exists" });
        }

        if (user.IsEmailConfirmed == true)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = $"{request.Email} is already confirmed" });
        }

        var token = _jwtGenerator.CreateToken(user);

        await _sender.SendEmailAsync(
          request.Email,
          "Email verification",
          EmailsMessages.ConfirmEmail(request.Email, token));

        return $"A confirmation email was sent to {request.Email}";
      }
    }
  }
}