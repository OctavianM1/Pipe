using System.Threading;
using System.Threading.Tasks;
using Application.Emails;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;

namespace Application.Users
{
  public class SendRecoveryPassword
  {
    public class Query : IRequest<string>
    {
      public string Email { get; set; }
    }
    public class Handler : IRequestHandler<Query, string>
    {
      private readonly DataContext _context;
      private readonly IJwtGeneratorService _jwtGenerator;
      private readonly IEmailSenderService _sender;
      private readonly IConfiguration _configuration;
      public Handler(DataContext context, IEmailSenderService sender, IJwtGeneratorService jwtGenerator, IConfiguration configuration)
      {
        this._configuration = configuration;
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

        var token = _jwtGenerator.CreateToken(user);

        await _sender.SendEmailAsync(
          request.Email,
          "Restore password",
          EmailsMessages.RecoveryPassword(request.Email, token, _configuration["ClientSideURL"]));

        return $"A restore password email was sent to {request.Email}";
      }
    }
  }
}