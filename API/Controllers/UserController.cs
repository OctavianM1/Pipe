using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Users;
using Application.Users.ApplicationUser;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  
  public class UserController : ControllerBase
  {
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(Guid id)
    {
      return await _mediator.Send(new Detail.Query { Id = id });
    }


    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
      return await _mediator.Send(command);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AppUser>> Login(Login.Query query)
    {
      return await _mediator.Send(query);
    }
  }
}