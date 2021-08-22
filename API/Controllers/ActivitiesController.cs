using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Extensions;
using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> GetActivities([FromQuery] ActivityParams param)
        {
            var pagedActivities = await Mediator.Send(new List.Query { Params = param });

            Response.AddPaginationHeader(
                pagedActivities.CurrentPage,
                pagedActivities.PageSize,
                pagedActivities.TotalCount,
                pagedActivities.TotalPages
            );

            return pagedActivities;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return Ok(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult> Attend(Guid id)
        {
            return Ok(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}