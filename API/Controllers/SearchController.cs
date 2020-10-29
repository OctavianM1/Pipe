using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Search;
using Application.Search.Inputs;
using Application.Users.ApplicationUser;
using ApplicationActivity;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SearchController
  {
    private readonly IMediator _mediator;
    public SearchController(IMediator mediator)
    {
      _mediator = mediator;
    }

    [HttpGet("usersNumber/{numberOfUsers}")]
    public async Task<ActionResult<List<AppUser>>> GetUsersOnNumber(int numberOfUsers)
    {
      return await _mediator.Send(new UsersNumber.Query { NumberOfUsers = numberOfUsers });
    }

    [HttpPost("allUsersMatch")]
    public async Task<ActionResult<List<AppUser>>> GetAllUsersMatch(MatchAllUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("followingUsersMatch")]
    public async Task<ActionResult<List<AppUser>>> GetFollowingUsersMatch(MatchFollowingUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("followsUsersMatch")]
    public async Task<ActionResult<List<AppUser>>> GetFollowsUsersMatch(MatchFollowsUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("searchAllUsers")]
    public async Task<ActionResult<List<Input>>> GetSearchAllUsers(AllUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("searchFollowingUsers")]
    public async Task<ActionResult<List<Input>>> GetSearchFollowingUsers(FollowingUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("searchFollowsUsers")]
    public async Task<ActionResult<List<Input>>> GetSearchFollowsUsers(FollowsUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputAllUsers")]
    public async Task<ActionResult<List<AppUser>>> SetInputAllUsers(SetInputAllUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputFollowingUsers")]
    public async Task<ActionResult<List<AppUser>>> SetInputFollowingUsers(SetInputFollowingUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputFollowsUsers")]
    public async Task<ActionResult<List<AppUser>>> SetInputFollowsUsers(SetInputFollowsUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpDelete("allUsers/{userId}/{input}")]
    public async Task<ActionResult<Unit>> DeleteAllUsersInput(string userId, string input)
    {
      return await _mediator.Send(new DeleteAllUsers.Query { UserId = Guid.Parse(userId), Input = input });
    }

    [HttpDelete("followingUsers/{userId}/{input}")]
    public async Task<ActionResult<Unit>> DeleteFollowingUsersInput(string userId, string input)
    {
      return await _mediator.Send(new DeleteFollowingUsers.Query { UserId = Guid.Parse(userId), Input = input });
    }

    [HttpDelete("followsUsers/{userId}/{input}")]
    public async Task<ActionResult<Unit>> DeleteFollowsUsersInput(string userId, string input)
    {
      return await _mediator.Send(new DeleteFollowsUsers.Query { UserId = Guid.Parse(userId), Input = input });
    }

    [HttpPost("activities")]
    public async Task<ActionResult<List<ActivityInput>>> GetActivitiesInputs(ActivitiesInputs.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputActivities")]
    public async Task<ActionResult<List<AppActivity>>> SetInputActivity(SetInputActivities.Command command)
    {
      return await _mediator.Send(command);
    }
    [HttpPost("deleteInputActivities")]
    public async Task<ActionResult<Unit>> DeleteActivitiesInput(DeleteInputActivities.Command command)
    {
      return await _mediator.Send(command);
    }
  }
}