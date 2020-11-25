using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Emails;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class Subscribe
  {
    public class Command : IRequest
    {
      public string Email { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IEmailSenderService _sender;
      public Handler(DataContext context, IEmailSenderService sender)
      {
        this._sender = sender;
        _context = context;

      }
      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        bool exists = await _context.SubscriberOnEmailNews.FirstOrDefaultAsync(s => s.Email == request.Email) != null;

        if (exists)
        {
          throw new RestException(System.Net.HttpStatusCode.BadRequest, new { email = "Email is already subscribed" });
        }

        await _sender.SendEmailAsync(request.Email, "Subscribe to Pipe", EmailsMessages.SubscribeEmail());

        _context.SubscriberOnEmailNews.Add(new SubscriberOnEmailNews
        {
          Email = request.Email
        });

        bool success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return Unit.Value;
        }
        throw new Exception("Someting went wrong when adding subscriber");
      }
    }
  }
}