using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.FollowsAndFollowing;
using Application.Users.ApplicationUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FollowsController : ControllerBase
  {
    private readonly IMediator _mediator;
    public FollowsController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet("followers/{id}")] 
    public async Task<ActionResult<List<AppUser>>> GetFollowers(string id)
    {
      return await _mediator.Send(new ListFollowers.Query { Id = Guid.Parse(id) });
    }

    [HttpGet("following/{id}")] 
    public async Task<ActionResult<List<AppUser>>> GetFollowing(string id)
    {
      return await _mediator.Send(new ListFollowing.Query { Id = Guid.Parse(id) });
    }

    [HttpPost("follow")]
    public async Task<ActionResult<Unit>> Follow(Follow.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("unfollow")]
    public async Task<ActionResult<Unit>> Unfollow(Unfollow.Command command)
    {
      return await _mediator.Send(command);
    }
  }
}