using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using ApplicationActivity;
using ApplicationComment;
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
    public async Task<ActionResult<List<AppActivity>>> GetActivities(string id)
    {
      return await _mediator.Send(new List.Query { Id = id });
    }

    [HttpGet("following/{id}")]
    public async Task<ActionResult<List<Activity>>> GetFollowingActivities(string id)
    {
      return await _mediator.Send(new FollowingActivityList.Query { Id = Guid.Parse(id) });
    }

    [HttpPost("create")]
    public async Task<ActionResult<Unit>> CreateActivity(Create.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> DeleteActivity(string id)
    {
      return await _mediator.Send(new Delete.Query { Id = id });
    }

    [HttpPost("like")]
    public async Task<ActionResult<Unit>> LikeActivity(LikeActivity.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("rate")]
    public async Task<ActionResult<Unit>> RateActivity(RateActivity.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("delete-rate")]
    public async Task<ActionResult<Unit>> DeleteRateActivity(DeleteRateActivity.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("add-comment")]
    public async Task<ActionResult<AppComment>> AddComment(AddComment.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("like-comment")]
    public async Task<ActionResult<Unit>> LikeComment(LikeComment.Command command)
    {
      return await _mediator.Send(command);
    }
  }
}