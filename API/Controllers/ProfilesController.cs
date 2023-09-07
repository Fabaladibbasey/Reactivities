using Application.Core;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserName = username }));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate, [FromQuery] PagingParams pagingParams)
        {
            return HandlePagedResult(await Mediator.Send(new ListActivities.Query { UserName = username, Predicate = predicate, PagingParams = pagingParams }));
        }


    }

}