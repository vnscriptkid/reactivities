using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<PagedList<ActivityDto>>
        {
            public PagingParams Params { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedList<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<PagedList<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .ProjectTo<ActivityDto>(
                        _mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetUsername() }
                    )
                    .AsQueryable();

                return await PagedList<ActivityDto>.CreateAsync(
                    query, request.Params.PageNumber, request.Params.PageSize);
            }
        }
    }
}