using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Users;
using Application.Users.ApplicationUser;
using ApplicationUser;
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
    public async Task<ActionResult<AppUser>> GetUser(Guid id)
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

    [HttpGet("{userHostId}/{userVisitorId}")]
    public async Task<ActionResult<AppUsersActivity>> GetUsersActivity(string userHostId, string userVisitorId)
    {
      return await _mediator.Send(new UsersActivity.Query { UserHostId = userHostId, UserVisitorId = userVisitorId });
    }

    [HttpPut("changeName")] 
    public async Task<ActionResult<AppUser>> UpdateName(UpdateName.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPut("changeEmail")]
    public async Task<ActionResult<AppUser>> UpdateEmail(UpdateEmail.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPut("changePassword")]
    public async Task<ActionResult<AppUser>> UpdatePassword(UpdatePassword.Command command)
    {
      return await _mediator.Send(command);
    }

  }
}