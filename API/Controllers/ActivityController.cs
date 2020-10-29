using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Activities.Comments;
using Application.Activities.Rate;
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

    [HttpPost]
    public async Task<ActionResult<List<AppActivity>>> GetActivities(List.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpGet("{userId}/{activityId}")]
    public async Task<ActionResult<AppActivity>> GetActivity(string userId, string activityId)
    {
      return await _mediator.Send(new Detail.Query { userId = userId, activityId = activityId });
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

    [HttpPut("update")]
    public async Task<ActionResult<Unit>> UpdateActivity(Update.Command command)
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

    [HttpPut("update-comment")]
    public async Task<ActionResult<Unit>> UpdateComment(UpdateComment.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpDelete("delete-comment/{id}")]
    public async Task<ActionResult<Unit>> DeleteComment(string id)
    {
      return await _mediator.Send(new DeleteComment.Query { Id = id });
    }

    [HttpPost("like-comment")]
    public async Task<ActionResult<Unit>> LikeComment(LikeComment.Command command)
    {
      return await _mediator.Send(command);
    }
  }
}