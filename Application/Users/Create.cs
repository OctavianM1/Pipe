using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Application.Emails;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;

namespace Application.Users
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Password { get; set; }
      public string Email { get; set; }
      public string Name { get; set; }
      public string Origin { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IEmailSenderService _sender;
      private readonly IJwtGeneratorService _jwtGenerator;
      private readonly IConfiguration _configuration;

      public Handler(DataContext context, IEmailSenderService sender, IJwtGeneratorService jwtGenerator, IConfiguration configuration)
      {
        _configuration = configuration;
        _jwtGenerator = jwtGenerator;
        _sender = sender;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        if (string.IsNullOrEmpty(request.Email)
          || string.IsNullOrEmpty(request.Password)
          || string.IsNullOrEmpty(request.Name))
        {
          var errors = new Dictionary<string, string>();
          if (string.IsNullOrEmpty(request.Email)) errors["email"] = "Invalid email";
          if (string.IsNullOrEmpty(request.Password)) errors["password"] = "Invalid password";
          if (string.IsNullOrEmpty(request.Name)) errors["name"] = "Invalid name";
          throw new RestException(HttpStatusCode.BadRequest, new { errors });
        }

        var existEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existEmail != null)
        {
          throw new RestException(HttpStatusCode.BadRequest, new { email = "Email already exists" });
        }

        var rfc2898DeriveBytes = new Rfc2898DeriveBytes(request.Password, 32)
        {
          IterationCount = 10000
        };
        byte[] hash = rfc2898DeriveBytes.GetBytes(20);
        byte[] salt = rfc2898DeriveBytes.Salt;
        string hashedPassword = Convert.ToBase64String(salt) + "|" + Convert.ToBase64String(hash);
        var user = new User
        {
          Id = request.Id,
          Email = request.Email,
          Password = hashedPassword,
          Name = request.Name,
          CountFollowers = 0,
          CountFollowing = 0
        };
        _context.Users.Add(user);
        var success = await _context.SaveChangesAsync() > 0;

        var token = _jwtGenerator.CreateToken(user);

        await _sender.SendEmailAsync(
          request.Email,
          "Email verification",
          EmailsMessages.ConfirmEmail(request.Email, token, _configuration["ClientSideURL"]));


        if (success)
        {
          return Unit.Value;
        }

        throw new Exception("Problem saving changes");
      }
    }
  }
}