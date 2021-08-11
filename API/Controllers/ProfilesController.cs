using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> UserProfile(string username)
        {
            return Ok(await Mediator.Send(new Details.Query { Username = username }));
        }
    }
}