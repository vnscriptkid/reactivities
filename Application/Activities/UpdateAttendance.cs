using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                                .Include(a => a.Attendees).ThenInclude(aa => aa.AppUser)
                                .SingleOrDefaultAsync(a => a.Id == request.Id);

                if (activity == null)
                    throw new Exception("Activity not found");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var hostUsername = activity.Attendees.FirstOrDefault(aa => aa.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(aa => aa.AppUserId == user.Id);

                if (attendance != null && user.UserName == hostUsername)
                {
                    // cancel it
                    activity.IsCancelled = true;
                }

                if (attendance != null && user.UserName != hostUsername)
                {
                    // leave activity
                    activity.Attendees.Remove(attendance);
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        Activity = activity,
                        AppUser = user,
                        IsHost = false
                    };
                    // join activity
                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Unit.Value;

                throw new Exception("Failed to update attendance");
            }
        }
    }
}