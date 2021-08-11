using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(IUserAccessor userAccessor, DataContext context)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users
                    .Include(u => u.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var targetPhoto = currentUser.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (targetPhoto == null) throw new Exception("Photo not found");

                var currentMainPhoto = currentUser.Photos.FirstOrDefault(p => p.IsMain);

                if (currentMainPhoto.Id == targetPhoto.Id)
                    throw new Exception("This is main photo already");

                targetPhoto.IsMain = true;

                currentMainPhoto.IsMain = false;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Failed to set main photo");
            }
        }
    }
}