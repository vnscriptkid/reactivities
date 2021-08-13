using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(IUserAccessor userAccessor, DataContext context)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var target = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                if (target == null) throw new Exception("Target user not found");

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Failed to follow user");
            }
        }
    }
}