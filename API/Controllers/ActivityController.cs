using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ActivityController : ControllerBase
  {
    private readonly IMediator _mediator;

    public ActivityController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<List<Activity>>> GetActivities(string id)
    {
      return await _mediator.Send(new List.Query { Id = id });
    }

    [HttpGet("following/{id}")]
    public async Task<ActionResult<List<Activity>>> GetFollowingActivities(string id)
    {
      return await _mediator.Send(new FollowingActivityList.Query { Id = Guid.Parse(id) });
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> CreateActivity(Create.Command command)
    {
      return await _mediator.Send(command);
    }
  }
}