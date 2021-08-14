using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<ActionResult> Follow(string username)
        {
            return Ok(await Mediator.Send(new FollowToggle.Command { TargetUsername = username }));
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> GetFollowings(string username, string predicate)
        {
            return Ok(await Mediator.Send(new List.Query { Username = username, Predicate = predicate }));
        }
    }
}