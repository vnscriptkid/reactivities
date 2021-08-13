using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<List<CommentDto>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Hanlder : IRequestHandler<Query, List<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Hanlder(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<List<CommentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                                .Where(c => c.Activity.Id == request.ActivityId)
                                .OrderByDescending(c => c.CreatedAt)
                                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                                .ToListAsync();

                return comments;
            }
        }
    }
}