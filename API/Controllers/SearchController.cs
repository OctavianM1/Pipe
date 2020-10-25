using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Search;
using Application.Search.Inputs;
using Application.Users.ApplicationUser;
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
    public async Task<ActionResult<Unit>> SetInputAllUsers(SetInputAllUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputFollowingUsers")]
    public async Task<ActionResult<Unit>> SetInputFollowingUsers(SetInputFollowingUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpPost("setInputFollowsUsers")]
    public async Task<ActionResult<Unit>> SetInputFollowsUsers(SetInputFollowsUsers.Command command)
    {
      return await _mediator.Send(command);
    }

    [HttpDelete("allUsers/{input}")]
    public async Task<ActionResult<Unit>> DeleteAllUsersInput(string input)
    {
      return await _mediator.Send(new DeleteAllUsers.Query { Input = input });
    }

    [HttpDelete("followingUsers/{input}")]
    public async Task<ActionResult<Unit>> DeleteFollowingUsersInput(string input)
    {
      return await _mediator.Send(new DeleteFollowingUsers.Query { Input = input });
    }

    [HttpDelete("followsUsers/{input}")]
    public async Task<ActionResult<Unit>> DeleteFollowsUsersInput(string input)
    {
      return await _mediator.Send(new DeleteFollowsUsers.Query { Input = input });
    }
  }
}