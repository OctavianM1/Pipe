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

    [HttpGet("allUsersMatch/{matchString}")]
    public async Task<ActionResult<List<AppUser>>> GetAllUsersMatch(string matchString)
    {
      return await _mediator.Send(new MatchAllUsers.Query { MatchString = matchString });
    }

    [HttpGet("followingUsersMatch/{matchString}")]
    public async Task<ActionResult<List<AppUser>>> GetFollowingUsersMatch(string matchString)
    {
      return await _mediator.Send(new MatchFollowingUsers.Query { MatchString = matchString });
    }

    [HttpGet("followsUsersMatch/{matchString}")]
    public async Task<ActionResult<List<AppUser>>> GetFollowsUsersMatch(string matchString)
    {
      return await _mediator.Send(new MatchFollowsUsers.Query { MatchString = matchString });
    }

    [HttpGet("searchAllUsers/{userId}/{matchString}")]
    public async Task<ActionResult<List<Input>>> GetSearchAllUsers(string userId, string matchString)
    {
      return await _mediator.Send(new AllUsers.Query { UserId = userId, MatchString = matchString });
    }

    [HttpGet("searchFollowingUsers/{userId}/{matchString}")]
    public async Task<ActionResult<List<Input>>> GetSearchFollowingUsers(string userId, string matchString)
    {
      return await _mediator.Send(new FollowingUsers.Query { UserId = userId, MatchString = matchString });
    }

    [HttpGet("searchFollowsUsers/{userId}/{matchString}")]
    public async Task<ActionResult<List<Input>>> GetSearchFollowsUsers(string userId, string matchString)
    {
      return await _mediator.Send(new FollowsUsers.Query { UserId = userId, MatchString = matchString });
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

    [HttpGet("activities/{userId}/{matchString}")]
    public async Task<ActionResult<List<AppActivity>>> GetActivitiesOnSearch(string userId, string matchString)
    {
      return await _mediator.Send(new List.Query { Id = userId, MatchString = matchString });
    }
  }
}