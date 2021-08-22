using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
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

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username, string predicate)
        {
            var activities = await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate });

            return activities;
        }
    }
}