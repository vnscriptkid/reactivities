using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(IUserAccessor userAccessor, IMapper mapper, DataContext context)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                // get current user
                var currentUser = await _context.Users
                    .Include(u => u.Photos)
                    .SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                // get target activity
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null) throw new Exception("Activity not found");

                // create new comment
                var comment = new Comment
                {
                    Activity = activity,
                    Author = currentUser,
                    Body = request.Body
                };

                // save new comment
                _context.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return _mapper.Map<CommentDto>(comment);

                throw new Exception("Failed to create comment");
            }
        }
    }
}