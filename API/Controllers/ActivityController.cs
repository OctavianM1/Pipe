using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Activities.Comments;
using Application.Activities.Rate;
using Application.Users.ApplicationUser;
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

    [HttpGet("getActivity/{activityId}")]
    public async Task<ActionResult<AppActivity>> GetActivity(string activityId)
    {
      return await _mediator.Send(new Detail.Query { activityId = activityId });
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

    [HttpPut("add-comment-response")]
    public async Task<ActionResult<List<AppCommentResponse>>> ResponseToComment(AddCommentResponse.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpGet("comment-responses/{commentId}")]
    public async Task<ActionResult<List<AppCommentResponse>>> GetCommentResponses(string commentId)
    {
      return await _mediator.Send(new GetResponsesOnComment.Query { commentId = Guid.Parse(commentId) });
    }

    [HttpPut("comment-response-add-like")]
    public async Task<ActionResult<AppUser>> AddLikeToCommentResponse(AddCommentResponseLike.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpDelete("delete-response-comment/{responseCommentId}")]
    public async Task<ActionResult<Unit>> OnDeleteResponseComment(string responseCommentId)
    {
      return await _mediator.Send(new DeleteResponseComment.Query { ResponseCommentId = Guid.Parse(responseCommentId) });
    } 

    [HttpPost("upldate-comment-response")]
    public async Task<ActionResult<string>> OnUpdateResponseComment(UpdateResponseComment.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("liked-activities")]
    public async Task<ActionResult<List<AppActivity>>> LikedActivities(LikedActivities.Query query) {
      return await _mediator.Send(query);
    }

    [HttpPost("rated-activities")]
    public async Task<ActionResult<List<AppActivity>>> RatedActivities(RatedActivities.Query query) {
      return await _mediator.Send(query);
    }

    [HttpPost("liked-comments")]
    public async Task<ActionResult<List<AppActivity>>> LikedComments(LikedComments.Query query) {
      return await _mediator.Send(query);
    } 
  }
}