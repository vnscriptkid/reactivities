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
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .Include(u => u.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (photo == null)
                {
                    throw new Exception("Photo not found");
                }

                if (photo.IsMain)
                {
                    throw new Exception("Can not delete main photo");
                }

                var deleteResult = await _photoAccessor.DeletePhoto(photo.Id);

                if (deleteResult == null)
                {
                    throw new Exception("Failed to delete photo");
                }

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Failed to remove photo from user");
            }
        }
    }
}