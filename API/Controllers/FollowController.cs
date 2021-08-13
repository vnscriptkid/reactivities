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
    }
}